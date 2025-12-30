import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wjnydegrspaxfdnptebd.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqbnlkZWdyc3BheGZkbnB0ZWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDc3ODIsImV4cCI6MjA4MDMyMzc4Mn0.2KHdSIweIpukWpBwp78X3-qqDMMEgy0Ows8R9kEN8kQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storage: {
            getItem: (key) => new Promise((resolve) => chrome.storage.local.get(key, (items) => resolve(items[key] as string))),
            setItem: (key, value) => new Promise((resolve) => chrome.storage.local.set({ [key]: value }, resolve)),
            removeItem: (key) => new Promise((resolve) => chrome.storage.local.remove(key, resolve)),
        },
    },
});

const ALARM_NAME = 'MICROBREAK_ALARM';

import { SyncService } from '../lib/SyncService';

// Initialize Sync Service
SyncService.init();

// Log Logic
// ... (Logic moved to SyncService)

// 2. Alarm Logic
function updateAlarms(intervalMinutes: number, startHour: number = 9, endHour: number = 17, workDays: number[] = [1, 2, 3, 4, 5]) {
    chrome.alarms.clear(ALARM_NAME);

    const now = new Date();
    let targetTime = new Date();

    // Helper: Find next valid work day start
    const getNextStart = (fromDate: Date): Date => {
        let d = new Date(fromDate);
        d.setHours(startHour, 0, 0, 0);
        // If the proposed start time is in the past (e.g. today 9am when it's 10am), handled by caller logic
        // But here we seek the *next* day logic usually.

        // Loop up to 7 days to find next work day
        for (let i = 0; i < 8; i++) {
            // If i=0, we are checking today.
            if (workDays.includes(d.getDay())) {
                return d;
            }
            d.setDate(d.getDate() + 1);
        }
        return d; // Should match
    };

    // Current Status
    const currentHour = now.getHours();
    const isWorkDay = workDays.includes(now.getDay());

    // Case 1: Active Work Time
    // Today is workday AND we are between start/end
    if (isWorkDay && currentHour >= startHour && currentHour < endHour) {
        // Schedule next break in 'interval' mins
        targetTime = new Date(now.getTime() + intervalMinutes * 60000);

        // Cap at end hour
        const todayEnd = new Date();
        todayEnd.setHours(endHour, 0, 0, 0);

        if (targetTime >= todayEnd) {
            // Push to next day
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            targetTime = getNextStart(tomorrow);
        }
    }
    // Case 2: Before Start on Work Day
    else if (isWorkDay && currentHour < startHour) {
        targetTime = new Date();
        targetTime.setHours(startHour, 0, 0, 0);
    }
    // Case 3: After End OR Non-Work Day
    else {
        // Find next day
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        targetTime = getNextStart(tomorrow);
    }

    // Safety: ensure target is in future
    if (targetTime <= now) {
        targetTime = new Date(now.getTime() + intervalMinutes * 60000);
    }

    chrome.alarms.create(ALARM_NAME, {
        when: targetTime.getTime(),
        periodInMinutes: intervalMinutes
        // Note: periodInMinutes will keep firing at this interval indefinitely.
        // It does NOT respect the "End Hour" automatically for subsequent firings.
        // For strict schedule compliance, we should use `when` (one-time) and reset it on each alarm.
        // But for simplicity in MV3, letting it repeat is okay, provided the alarm listener checks the time.
        // BETTER: The alarm listener checks "Is this within valid hours?". If not, it snoozes to next morning.
    });

    console.log(`Alarm set for ${targetTime.toLocaleString()} (Interval: ${intervalMinutes}m)`);
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("MicroBreaks Personal Installed");
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    chrome.alarms.clearAll();

    // 1. precise Install Date for Trial
    chrome.storage.local.get(['installDate'], (res) => {
        if (!res.installDate) {
            chrome.storage.local.set({ installDate: Date.now() });
        }
    });

    // 2. Default Settings
    const defaultSettings = {
        work_interval_minutes: 30,
        start_hour: 9,
        end_hour: 17,
        work_days: [1, 2, 3, 4, 5] // Mon-Fri
    };

    chrome.storage.local.set({ settings: defaultSettings });
    updateAlarms(30, 9, 17, [1, 2, 3, 4, 5]);

    SyncService.syncNow();

    // Debugging: Test Notification for Side Panel
    setTimeout(() => {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
            title: 'Side Panel Test 🧪',
            message: 'Click this notification to open the Side Panel!',
            priority: 2,
            requireInteraction: true
        });
    }, 3000);
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === ALARM_NAME) {
        // 0. Check for Active Session first
        // If user is logged out, suppress everything
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            console.log("No active session. Notification suppressed.");
            return;
        }

        // Check for trial expiration AND Schedule Validity before showing notification
        chrome.storage.local.get(['installDate', 'settings'], (res) => {
            const installDate = (res.installDate as number) || Date.now();
            const daysUsed = (Date.now() - installDate) / (1000 * 60 * 60 * 24);
            const isTrialExpired = daysUsed > 7;

            // If trial expired, do NOT show notification
            if (isTrialExpired) {
                console.log("Trial expired. Notification suppressed.");
                return;
            }

            // Check Schedule (Day & Time)
            const settings = res.settings as {
                work_interval_minutes: number;
                start_hour: number;
                end_hour: number;
                work_days: number[];
            };
            if (settings) {
                const now = new Date();
                const currentDay = now.getDay();
                const currentHour = now.getHours();

                // 1. Check Day
                if (settings.work_days && !settings.work_days.includes(currentDay)) {
                    console.log(`Suppressed: Today (${currentDay}) is not in work days:`, settings.work_days);
                    return;
                }

                // 2. Check Time
                // Note: start_hour is inclusive, end_hour is exclusive (e.g. 9 to 17 means runs until 16:59)
                if (settings.start_hour !== undefined && settings.end_hour !== undefined) {
                    if (currentHour < settings.start_hour || currentHour >= settings.end_hour) {
                        console.log(`Suppressed: Current hour ${currentHour} is outside ${settings.start_hour}-${settings.end_hour}`);
                        return;
                    }
                }
            }

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
                title: 'Time for a MicroBreak! 🧘',
                message: 'Take 2 minutes to stretch and refresh.',
                buttons: [
                    { title: 'Start Exercise' },
                    { title: 'Snooze 5m' }
                ],
                priority: 2,
                requireInteraction: true
            });
        });
    }
});

let lastWindowId: number | undefined;

// Track the last focused window
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        lastWindowId = windowId;
    }
});

// Initialize logic to capture current window if SW just started
chrome.windows.getLastFocused({ windowTypes: ['normal'] }).then(win => {
    if (win?.id) lastWindowId = win.id;
});

// Helper to open side panel
// Tries to perform the action synchronously if possible to preserve user gesture
function openSidePanel() {
    if (lastWindowId) {
        console.log(`Attempting Synchronous Open in window ${lastWindowId}`);
        // Bring window to front (Fire and forget, doesn't block sidePanel.open)
        chrome.windows.update(lastWindowId, { focused: true }).catch(err => console.error("Focus failed", err));

        // This is synchronous invocation (fire and forget promise)
        chrome.sidePanel.open({ windowId: lastWindowId }).catch(err => {
            console.error("Sync open failed, falling back:", err);
            openSidePanelFallback();
        });
    } else {
        openSidePanelFallback();
    }
}

async function openSidePanelFallback() {
    console.log("Attempting Async Fallback (Launcher)...");
    // Since we lost the user gesture context for sidePanel.open, we open a launcher tab.
    // chrome.tabs.create usually works even with loose gesture rules or it acts as a popup.
    chrome.tabs.create({ url: 'launcher.html' });
}

chrome.notifications.onClicked.addListener(() => {
    console.log("Notification Clicked!");
    chrome.storage.local.set({ isBreakActive: true });
    openSidePanel();
});

chrome.notifications.onButtonClicked.addListener((_notificationId: string, buttonIndex: number) => {
    if (buttonIndex === 0) {
        console.log("Button Clicked!");
        chrome.storage.local.set({ isBreakActive: true });
        openSidePanel();
    } else if (buttonIndex === 1) {
        chrome.alarms.create(ALARM_NAME, { delayInMinutes: 5 });
    }
});

// Message from Frontend (e.g. after Login or Settings Change)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'SYNC_SETTINGS') {
        SyncService.syncNow();
        sendResponse({ status: 'sync_started' });
    }
    else if (message.action === 'UPDATE_ALARMS') {
        const s = message.settings;
        if (s) {
            updateAlarms(s.work_interval_minutes, s.start_hour, s.end_hour, s.work_days);
            console.log("Alarms updated via frontend message:", s);
        }
    }
});
