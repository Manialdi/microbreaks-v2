import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnhhlyceginwmeyohafs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaGhseWNlZ2lud21leW9oYWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjcyNTAsImV4cCI6MjA4MTgwMzI1MH0.OzTkw1jgzzShzWMxD5bzH8-s4DYctY9sYb_8LQh9j9k';

const ChromeStorageAdapter = {
    getItem: (key: string) => {
        return new Promise<string | null>((resolve) => {
            chrome.storage.local.get([key], (result: { [key: string]: any }) => {
                resolve(result[key] || null);
            });
        });
    },
    setItem: (key: string, value: string) => {
        return new Promise<void>((resolve) => {
            chrome.storage.local.set({ [key]: value }, () => resolve());
        });
    },
    removeItem: (key: string) => {
        return new Promise<void>((resolve) => {
            chrome.storage.local.remove([key], () => resolve());
        });
    },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ChromeStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Extension doesn't use URL for auth usually
    },
})
