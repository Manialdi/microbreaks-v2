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

// --- Core Scheduling Logic (From Personal Extension) ---

interface Settings {
    work_interval_minutes: number;
    break_duration_minutes?: number;
    start_hour: number;
    end_hour: number;
    work_days: number[];
    user_override?: boolean;
    userId?: string;
}

// Helper to sanitize work days to 0-6 (Sun-Sat)
const parseWorkDays = (raw: any): number[] => {
    if (!Array.isArray(raw)) return [1, 2, 3, 4, 5]; // Default M-F

    return raw.map(d => {
        if (typeof d === 'number') return d;
        if (typeof d === 'string') {
            // Try number parse
            const num = parseInt(d);
            if (!isNaN(num)) return num;

            // Try day name match
            const lower = d.toLowerCase();
            if (lower.startsWith('sun')) return 0;
            if (lower.startsWith('mon')) return 1;
            if (lower.startsWith('tue')) return 2;
            if (lower.startsWith('wed')) return 3;
            if (lower.startsWith('thu')) return 4;
            if (lower.startsWith('fri')) return 5;
            if (lower.startsWith('sat')) return 6;
        }
        return -1;
    }).filter(d => d >= 0 && d <= 6);
};

async function scheduleNextAlarm() {
    // 1. Get Settings
    const { settings } = await chrome.storage.local.get(['settings']);

    const defaultSettings: Settings = {
        work_interval_minutes: 30,
        start_hour: 9,
        end_hour: 17,
        work_days: [1, 2, 3, 4, 5]
    };

    const s = (settings as Settings) || defaultSettings;

    const intervalMinutes = s.work_interval_minutes || 30; // Safety fallback
    const startHour = s.start_hour ?? 9;
    const endHour = s.end_hour ?? 17;
    const workDays = s.work_days || [1, 2, 3, 4, 5];

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
    if (targetTime.getTime() <= now.getTime()) {
        const diff = now.getTime() - targetTime.getTime();
        const intervalsNeeded = Math.floor(diff / (intervalMinutes * 60000)) + 1;
        targetTime = new Date(targetTime.getTime() + intervalsNeeded * intervalMinutes * 60000);
    }

    // 3. Set One-Shot Alarm (Scheduler)
    await chrome.alarms.clear(ALARM_SCHEDULER);

    chrome.alarms.create(ALARM_SCHEDULER, {
        when: targetTime.getTime()
    });

    console.log(`[Scheduler] Next MICROBREAK at ${targetTime.toLocaleString()} (Interval: ${intervalMinutes}m)`);
}

// --- Sync Logic (Company Specific) ---

async function syncCompanySettings() {
    try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) return;

        const user = sessionData.session.user;
        let companyId = null;

        // A. Try as Employee
        const { data: employee } = await supabase
            .from('employees')
            .select('company_id')
            .eq('auth_user_id', user.id)
            .limit(1)
            .single();

        if (employee) {
            companyId = employee.company_id;
        } else {
            // B. Try as HR Admin (Profile)
            const { data: profile } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', user.id)
                .limit(1)
                .single();

            if (profile) {
                companyId = profile.company_id;
            }
        }

        if (!companyId) {
            console.log("No company found for user:", user.email);
            return;
        }

        // Get Settings
        const { data: settings } = await supabase
            .from('company_settings')
            .select('*')
            .eq('company_id', companyId)
            .single();

        if (settings) {
            // Check for local overrides first
            const { settings: localSettings } = await chrome.storage.local.get(['settings']);

            const currentSettings = localSettings as Settings;
            // Check if settings belong to the current logged-in user
            const isSameUser = currentSettings && currentSettings.userId === user.id;

            if (isSameUser && currentSettings.user_override) {
                console.log("Skipping sync: User has overridden settings locally.");
                // Only update metadata, preserve user settings
                await chrome.storage.local.set({ companyId: companyId });
            } else {
                // New user or no override or mismatch -> Apply Company Defaults
                const safeWorkDays = parseWorkDays(settings.work_days);

                const newSettings: Settings = {
                    work_interval_minutes: settings.work_interval_minutes || 60,
                    break_duration_minutes: settings.break_duration_minutes || 2,
                    start_hour: settings.start_hour ?? 9,
                    end_hour: settings.end_hour ?? 17,
                    work_days: safeWorkDays.length > 0 ? safeWorkDays : [1, 2, 3, 4, 5],
                    userId: user.id, // Bind to current user
                    user_override: false
                };

                await chrome.storage.local.set({
                    settings: newSettings,
                    companyId: companyId
                });
                console.log("Settings Synced (Company Defaults):", newSettings);
            }

            // Trigger Scheduler
            await scheduleNextAlarm();
        }

    } catch (err) {
        console.error("Sync Error:", err);
    }
}

// --- Notification Logic ---

function showNotification() {
    chrome.notifications.clear(NOTIFICATION_ID, () => {
        chrome.notifications.create(NOTIFICATION_ID, {
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

// --- Event Listeners ---

chrome.runtime.onInstalled.addListener(() => {
    console.log("[Background] Installed/Updated");
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    // Clear legacy alarms
    chrome.alarms.clearAll();

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

    syncCompanySettings();
    scheduleNextAlarm();
});

chrome.runtime.onStartup.addListener(() => {
    console.log("[Background] Startup");
    scheduleNextAlarm();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    console.log(`[Alarm Triggered] ${alarm.name}`);

    // HANDLING MAIN SCHEDULER
    if (alarm.name === ALARM_SCHEDULER) {
        // 1. Immediately schedule the NEXT one
        await scheduleNextAlarm();

        // 2. Check Session & Logic
        const storage = await chrome.storage.local.get(null);
        const { data } = await supabase.auth.getSession();
        const hasLocalToken = Object.keys(storage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'));

        if (!data.session && !hasLocalToken) {
            console.log("No active session. Suppressed.");
            return;
        }

        showNotification();
    }
    // HANDLING SNOOZE
    else if (alarm.name === ALARM_SNOOZE) {
        showNotification();
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
        chrome.storage.local.set({ isBreakActive: true, breakSessionId: Date.now() });
        openSidePanel();
    } else if (buttonIndex === 1) {
        // Snooze
        console.log("Snoozing for 5m...");
        chrome.alarms.create(ALARM_SNOOZE, { delayInMinutes: 5 });
    }
});

// Messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'SYNC_SETTINGS') {
        syncCompanySettings();
        sendResponse({ status: 'sync_started' });
    }
    else if (message.action === 'UPDATE_ALARMS') {
        // Triggered by Dashboard Save
        console.log("Refresing Schedule from Dashboard...");
        scheduleNextAlarm();
        sendResponse({ status: 'scheduled' });
    }
});

// --- Window & SidePanel Logic ---

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
    chrome.tabs.create({ url: 'sidepanel.html' });
}
