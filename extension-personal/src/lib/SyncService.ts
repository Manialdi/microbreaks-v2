import { supabase } from './supabase';

const SYNC_ALARM = 'SYNC_LOGS';

export const SyncService = {
    init: () => {
        // 1. Listen for Auth Changes to trigger immediate sync
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                console.log("[Sync] User signed in. Triggering sync...");
                SyncService.syncNow();
            }
        });

        // 2. Setup Periodic Sync (if user is logged in)
        chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 60 });
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === SYNC_ALARM) {
                SyncService.syncNow();
            }
        });
    },

    syncNow: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log("[Sync] No user logged in. Skipping.");
            return;
        }

        // Get Local Stats
        const { stats } = (await chrome.storage.local.get(['stats'])) as any;
        if (!stats || !stats.total_seconds) {
            console.log("[Sync] No local stats to sync.");
            return;
        }

        console.log("[Sync] Syncing stats...", stats);

        // In a real app, we'd sync granular logs. 
        // For this simplified version, we'll insert a summary log if it hasn't been synced recently.
        // OR better: we can just update a 'profiles' column for total_time?
        // Let's stick to the schema: insert a log entry for the accumulated time since last sync?
        // Actually, to avoid complexity, let's just Upsert the TOTAL into a 'daily_summary' or similar?
        // The current schema has `personal_logs` which takes a duration.
        // Strategy: We will calculate 'unsynced_seconds' and push that as a new log.

        const { last_synced_seconds } = (await chrome.storage.local.get(['last_synced_seconds'])) as any;
        const synced = last_synced_seconds || 0;
        const currentTotal = stats.total_seconds || 0;
        const diff = currentTotal - synced;

        if (diff > 0) {
            const { error } = await supabase.from('personal_logs').insert({
                user_id: user.id,
                duration_seconds: diff,
                completed_at: new Date().toISOString()
            });

            if (!error) {
                console.log(`[Sync] Successfully synced ${diff} seconds.`);
                await chrome.storage.local.set({ last_synced_seconds: currentTotal });
            } else {
                console.error("[Sync] Failed to insert log:", error);
            }
        } else {
            console.log("[Sync] Nothing new to sync.");
        }
    }
};
