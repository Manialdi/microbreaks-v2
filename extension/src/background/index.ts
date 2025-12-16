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

// 1. Sync Logic
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
            await chrome.storage.local.set({
                settings: settings,
                companyId: companyId
            });
            console.log("Settings Synced:", settings);

            // Calculate Interval
            const interval = settings.work_interval_minutes || 60;
            const startHour = settings.start_hour;
            const endHour = settings.end_hour;
            updateAlarms(interval, startHour, endHour);
        }

    } catch (err) {
        console.error("Sync Error:", err);
    }
}

// 2. Alarm Logic
function updateAlarms(intervalMinutes: number, startHour?: number, endHour?: number) {
    chrome.alarms.clear(ALARM_NAME);

    // Defaults
    const sHour = startHour ?? 9;
    const eHour = endHour ?? 17;

    const now = new Date();

    const start = new Date();
    start.setHours(sHour, 0, 0, 0);

    const end = new Date();
    end.setHours(eHour, 0, 0, 0);

    // Handle Overnight Shift (e.g., 18:00 to 02:00)
    // If end hour is smaller than start hour, end time is tomorrow.
    if (eHour < sHour) {
        end.setDate(end.getDate() + 1);

        // If "now" is early morning (e.g. 1 AM) and shift started yesterday eventing (6 PM),
        // we need to make sure 'start' is yesterday, not today 6 PM.
        // Logic: If now < end (2 AM) and now < start (6 PM), then we are in the tail end of the shift.
        if (now < end && now.getHours() < sHour) {
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() - 1); // Reset end to be "today" early morning relative to the start
            // Wait, keeping date math simple:
            // Shift is [Yesterday 18:00] to [Today 02:00]
            // If Now is [Today 01:00], we want Start to be Yesterday.
        }
    }

    // Correction for "tail end" logic above was slightly confusing. Let's simplify absolute timestamps.
    // If eHour < sHour (Overnight):
    // Case A: Now is 20:00 (Evening). Start=Today 18:00. End=Tomorrow 02:00. Correct.
    // Case B: Now is 01:00 (Morning). Start=Today 18:00 (Wrong, should be yest). End=Tomorrow 02:00 (Wrong, should be today).

    if (eHour < sHour) {
        // Reset and recalculate carefully
        const currentHour = now.getHours();

        // adjustable Start/End based on where we are
        if (currentHour < eHour) {
            // We are in the early morning part of the shift (00:00 - 02:00)
            // Start was yesterday
            start.setDate(start.getDate() - 1);
            end.setDate(now.getDate()); // End is today
            end.setHours(eHour, 0, 0, 0);
        } else {
            // We are in the evening part of the shift (18:00 - 23:59)
            // Start is today. End is tomorrow.
            start.setHours(sHour, 0, 0, 0); // Reset in case
            end.setDate(now.getDate() + 1);
            end.setHours(eHour, 0, 0, 0);
        }
    }

    let nextBreak = new Date(start.getTime());

    // If we are already past the start time, find the next slot
    if (now > start) {
        const elapsedMins = (now.getTime() - start.getTime()) / 60000;
        const cycles = Math.floor(elapsedMins / intervalMinutes) + 1;
        nextBreak = new Date(start.getTime() + cycles * intervalMinutes * 60000);
    } else {
        // Before work starts: First break is start + interval
        nextBreak = new Date(start.getTime() + intervalMinutes * 60000);
    }

    // Check if the calculated next break is past end time
    if (nextBreak.getTime() >= end.getTime()) {
        // Schedule for tomorrow's first break
        // If it was overnight, "tomorrow" means the next start cycle.
        const nextStart = new Date(start);
        nextStart.setDate(nextStart.getDate() + 1);
        nextBreak = new Date(nextStart.getTime() + intervalMinutes * 60000);
    }

    // Double check: if nextBreak is somehow in the past (edge cases), push it
    if (nextBreak <= now) {
        nextBreak = new Date(now.getTime() + intervalMinutes * 60000);
    }

    chrome.alarms.create(ALARM_NAME, {
        when: nextBreak.getTime(),
        periodInMinutes: intervalMinutes
    });

    console.log(`Alarm set for ${nextBreak.toLocaleTimeString()} (Every ${intervalMinutes}m)`);
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("MicroBreaks Extension Installed");
    chrome.alarms.clearAll();
    syncCompanySettings();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon-128.png',
            title: 'Time for a MicroBreak! 🧘',
            message: 'Take 2 minutes to stretch and refresh.',
            buttons: [
                { title: 'Start Exercise' },
                { title: 'Snooze 5m' }
            ],
            priority: 2
        });
    }
});

chrome.notifications.onButtonClicked.addListener((_notificationId: string, buttonIndex: number) => {
    if (buttonIndex === 0) {
        // "Start Exercise" clicked
        chrome.windows.create({
            url: 'index.html',
            type: 'popup',
            width: 400,
            height: 600
        });
    } else if (buttonIndex === 1) {
        // "Snooze 5m" clicked
        chrome.alarms.create(ALARM_NAME, { delayInMinutes: 5 });
    }
});

// Message from Frontend (e.g. after Login)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'SYNC_SETTINGS') {
        syncCompanySettings();
        sendResponse({ status: 'sync_started' });
    }
});
