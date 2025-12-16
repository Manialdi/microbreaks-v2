import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
