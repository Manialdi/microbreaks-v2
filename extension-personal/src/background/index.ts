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

const ALARM_SCHEDULER = 'MICROBREAK_SCHEDULER';
const ALARM_SNOOZE = 'MICROBREAK_SNOOZE';
const NOTIFICATION_ID = 'MICROBREAK_NOTIFICATION';

import { SyncService } from '../lib/SyncService';

// Initialize Sync Service
SyncService.init();

// --- Core Scheduling Logic ---

// Define Settings Interface
interface Settings {
    work_interval_minutes: number;
    start_hour: number;
    end_hour: number;
    work_days: number[];
}

async function scheduleNextAlarm() {
    // 1. Get Settings
    const { settings } = await chrome.storage.local.get(['settings']);

    const defaultSettings: Settings = {
        work_interval_minutes: 30,
        start_hour: 9,
        end_hour: 17,
        work_days: [1, 2, 3, 4, 5]
    };

    // Default fallback if no settings found
    // Cast settings to 'any' first if needed, then to Settings, or rely on the union
    const s = (settings as Settings) || defaultSettings;

    const intervalMinutes = s.work_interval_minutes;
    const startHour = s.start_hour;
    const endHour = s.end_hour;
    const workDays = s.work_days;

    // 2. Calculate Next Target Time
    const now = new Date();
    let targetTime = new Date();

    // Helper: Find next valid work day start
    const getNextStart = (fromDate: Date): Date => {
        let d = new Date(fromDate);
        d.setHours(startHour, 0, 0, 0);

        // Loop up to 8 days to find next work day
        for (let i = 0; i < 8; i++) {
            if (workDays.includes(d.getDay())) {
                return d;
            }
            d.setDate(d.getDate() + 1);
        }
        return d;
    };

    const currentHour = now.getHours();
    const isWorkDay = workDays.includes(now.getDay());

    // START OF SHIFT CALCULATION
    let startOfToday = new Date(now);

    // Check for overnight shift logic (e.g. 6 PM start, currently 2 AM)
    if (startHour > endHour && currentHour < endHour) {
        startOfToday.setDate(startOfToday.getDate() - 1);
    }
    startOfToday.setHours(startHour, 0, 0, 0);

    const diffMs = now.getTime() - startOfToday.getTime();

    // Case 2: Before Start
    if (diffMs < 0) {
        targetTime = new Date(startOfToday);
    } else {
        // Case 1: Within Shift (or assumed)
        let nextSlotIndex = Math.floor((diffMs / 60000) / intervalMinutes) + 1;
        targetTime = new Date(startOfToday.getTime() + nextSlotIndex * intervalMinutes * 60000);
    }

    // LIMIT CHECK (End of Shift)
    const limitTime = new Date(startOfToday);
    limitTime.setHours(endHour, 0, 0, 0);
    if (startHour > endHour) {
        limitTime.setDate(limitTime.getDate() + 1);
    }

    if (targetTime >= limitTime) {
        // Shift Ended -> Find Next Day
        const nextDayCandidate = new Date(startOfToday);
        nextDayCandidate.setDate(nextDayCandidate.getDate() + 1);
        targetTime = getNextStart(nextDayCandidate);
    } else if (!isWorkDay && diffMs >= 0) {
        // Today is not a workday, find next start
        const nextDayCandidate = new Date(now);
        nextDayCandidate.setDate(nextDayCandidate.getDate() + 1);
        targetTime = getNextStart(nextDayCandidate);
    }

    // SAFETY: Ensure STRICTLY Future
    // Instead of looping, calculate mathematical offset directly.
    if (targetTime.getTime() <= now.getTime()) {
        const diff = now.getTime() - targetTime.getTime();
        const intervalsNeeded = Math.floor(diff / (intervalMinutes * 60000)) + 1;
        targetTime = new Date(targetTime.getTime() + intervalsNeeded * intervalMinutes * 60000);
    }

    // 3. Set One-Shot Alarm
    // Clear existing to avoid duplicates (though create usually overwrites)
    await chrome.alarms.clear(ALARM_SCHEDULER);

    chrome.alarms.create(ALARM_SCHEDULER, {
        when: targetTime.getTime()
    });

    console.log(`[Scheduler] Next MICROBREAK at ${targetTime.toLocaleString()} (Interval: ${intervalMinutes}m)`);
}

// --- Event Listeners ---

chrome.runtime.onInstalled.addListener(() => {
    console.log("[Background] Installed/Updated");
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    // Clear legacy alarms
    chrome.alarms.clearAll();

    // Initialize Install Date
    chrome.storage.local.get(['installDate'], (res) => {
        if (!res.installDate) {
            chrome.storage.local.set({ installDate: Date.now() });
        }
    });

    // Default Settings
    const defaultSettings = {
        work_interval_minutes: 30,
        start_hour: 9,
        end_hour: 17,
        work_days: [1, 2, 3, 4, 5]
    };
    chrome.storage.local.get(['settings'], (res) => {
        if (!res.settings) {
            chrome.storage.local.set({ settings: defaultSettings });
        }
    });

    SyncService.syncNow();
    scheduleNextAlarm();
});

// Proactive Startup Check (for browser updates/restarts)
chrome.runtime.onStartup.addListener(() => {
    console.log("[Background] Startup");
    scheduleNextAlarm();
});

async function showNotification() {
    const { avatar_data_url: avatarDataUrl } = await chrome.storage.local.get(['avatar_data_url']);
    const notificationIcon = typeof avatarDataUrl === 'string'
        ? avatarDataUrl
        : chrome.runtime.getURL('assets/logo-v2.jpg');
    // Clear previous notification to prevent stacking
    chrome.notifications.clear(NOTIFICATION_ID, () => {
        chrome.notifications.create(NOTIFICATION_ID, {
            type: 'basic',
            iconUrl: notificationIcon,
            title: typeof avatarDataUrl === 'string' ? 'Your break buddy is here ✨' : 'Time for a MicroBreak! 🧘',
            message: typeof avatarDataUrl === 'string' ? 'Let’s take 2 minutes to stretch together.' : 'Take 2 minutes to stretch and refresh.',
            buttons: [
                { title: 'Start Exercise' },
                { title: 'Snooze 5m' }
            ],
            priority: 2,
            requireInteraction: true
        });
    });
}

async function showAvatarOnActiveChromeTab() {
    try {
        const window = await chrome.windows.getLastFocused();
        if (!window.focused) return;
        const tabs = await chrome.tabs.query({ active: true, windowId: window.id });
        const activeTab = tabs[0];
        if (!activeTab?.id || !activeTab.url || /^(chrome|edge|about|devtools):/.test(activeTab.url)) return;
        await chrome.tabs.sendMessage(activeTab.id, { action: 'SHOW_AVATAR_REMINDER' });
    } catch {
        // Restricted browser pages cannot host an extension content script.
    }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log(`[Alarm Triggered] ${alarm.name}`);

    // HANDLING MAIN SCHEDULER
    if (alarm.name === ALARM_SCHEDULER) {
        // 1. Immediately schedule the NEXT one to keep the loop alive
        // We do this first to ensure continuity even if notification logic fails
        await scheduleNextAlarm();

        // 2. Logic to Show Notification
        // Check Session
        // Debug: Log complete storage to understand why session is missing
        const storage = await chrome.storage.local.get(null);
        console.log("[Debug] Storage Keys:", Object.keys(storage));

        const { data } = await supabase.auth.getSession();

        // precise session check fallback
        // The key usually looks like: sb-<project_ref>-auth-token
        const hasLocalToken = Object.keys(storage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'));

        if (!data.session && !hasLocalToken) {
            console.log("No active session (Supabase & Local Token missing). Suppressed.");
            return;
        }

        if (!data.session && hasLocalToken) {
            console.log("Supabase session missing but Local Token found. Treating as Logged In.");
        }

        // Check Trial - REMOVED for Free Plan (Confirmed v1.0.5)
        console.log("Trial check skipped (Free Plan active).");
        // const res = await chrome.storage.local.get(['installDate']);
        // const installDate = (res.installDate as number) || Date.now();
        // const daysUsed = (Date.now() - installDate) / (1000 * 60 * 60 * 24);
        // const isTrialExpired = daysUsed > 7;

        // if (isTrialExpired) {
        //    console.log("Trial expired. Suppressed.");
        //    return;
        // }

        // Validity Checks (Time/Day) are now effectively handled by the scheduler logic itself!
        // The scheduler ONLY creates alarms for valid times. 
        // So if an alarm fires, it IS a valid time (unless settings changed in the interim).

        showNotification();
        showAvatarOnActiveChromeTab();
    }

    // HANDLING SNOOZE
    else if (alarm.name === ALARM_SNOOZE) {
        // Just show notification again
        showNotification();
        showAvatarOnActiveChromeTab();
    }
});


// Notification Interactions
chrome.notifications.onClicked.addListener(() => {
    console.log("Notification Clicked -> Open Panel");
    chrome.storage.local.set({ isBreakActive: true, breakSessionId: Date.now() });
    openSidePanel();
});

chrome.notifications.onButtonClicked.addListener((_notificationId: string, buttonIndex: number) => {
    if (buttonIndex === 0) {
        // Start
        console.log("Button: Start");
        chrome.storage.local.set({ isBreakActive: true, breakSessionId: Date.now() });
        openSidePanel();
    } else if (buttonIndex === 1) {
        // Snooze
        console.log("Button: Snooze 5m");
        // Create INDEPENDENT snooze alarm. Does NOT affect scheduler.
        chrome.alarms.create(ALARM_SNOOZE, { delayInMinutes: 5 });
    }
});

// Messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'SYNC_SETTINGS') {
        SyncService.syncNow();
        sendResponse({ status: 'sync_started' });
    }
    else if (message.action === 'UPDATE_ALARMS') {
        // Frontend request to refresh schedule (e.g. after save)
        scheduleNextAlarm();
        sendResponse({ status: 'scheduled' });
    }
    else if (message.action === 'AVATAR_START_BREAK') {
        chrome.storage.local.set({ isBreakActive: true, breakSessionId: Date.now() });
        openSidePanel();
        sendResponse({ status: 'opening' });
    }
    else if (message.action === 'AVATAR_SNOOZE') {
        chrome.alarms.create(ALARM_SNOOZE, { delayInMinutes: 5 });
        sendResponse({ status: 'snoozed' });
    }
    else if (message.action === 'AVATAR_DISMISS') {
        sendResponse({ status: 'dismissed' });
    }
});

// --- Window & SidePanel Logic (Unchanged) ---
let lastWindowId: number | undefined;

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        lastWindowId = windowId;
    }
});

chrome.windows.getLastFocused({ windowTypes: ['normal'] }).then(win => {
    if (win?.id) lastWindowId = win.id;
});

function openSidePanel() {
    if (lastWindowId) {
        chrome.windows.update(lastWindowId, { focused: true }).catch(err => console.error(err));
        chrome.sidePanel.open({ windowId: lastWindowId }).catch(err => {
            console.error("Sync open failed", err);
            openSidePanelFallback();
        });
    } else {
        openSidePanelFallback();
    }
}

async function openSidePanelFallback() {
    chrome.tabs.create({ url: 'launcher.html' });
}
