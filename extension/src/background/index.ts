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

        // Get Employee Details to find Company
        const { data: employee } = await supabase
            .from('employees')
            .select('company_id')
            .eq('auth_user_id', user.id)
            .single();

        if (!employee) return;

        // Get Settings
        const { data: settings } = await supabase
            .from('company_settings')
            .select('*')
            .eq('company_id', employee.company_id)
            .single();

        if (settings) {
            await chrome.storage.local.set({
                settings: settings,
                companyId: employee.company_id
            });
            console.log("Settings Synced:", settings);

            // Calculate Interval
            const interval = settings.work_interval_minutes || 60;
            updateAlarms(interval);
        }

    } catch (err) {
        console.error("Sync Error:", err);
    }
}

// 2. Alarm Logic
function updateAlarms(intervalMinutes: number) {
    chrome.alarms.clear(ALARM_NAME);
    chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: intervalMinutes,
        periodInMinutes: intervalMinutes
    });
    console.log(`Alarm set for every ${intervalMinutes} minutes`);
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
