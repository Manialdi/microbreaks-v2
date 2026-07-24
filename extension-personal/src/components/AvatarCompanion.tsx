import { useEffect, useState } from 'react';

export default function AvatarCompanion({ celebrating = false }: { celebrating?: boolean }) {
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        chrome.storage.local.get(['avatar_data_url'], result => {
            setAvatar(typeof result.avatar_data_url === 'string' ? result.avatar_data_url : null);
        });
    }, []);

    if (!avatar) return null;
    return (
        <div className={`fixed right-3 bottom-3 z-40 flex items-end gap-2 pointer-events-none ${celebrating ? 'avatar-celebrate' : 'avatar-enter'}`}>
            <div className="mb-3 bg-white px-3 py-2 rounded-2xl rounded-br-sm shadow-xl border border-indigo-100 text-[11px] font-bold text-indigo-900 max-w-32">
                {celebrating ? 'You did it! ✨' : 'I’ll stretch with you!'}
            </div>
            <img src={avatar} alt="Your break buddy" className="w-20 h-28 rounded-2xl object-contain bg-white border-4 border-white shadow-2xl" />
        </div>
    );
}
