const HOST_ID = 'microbreaks-avatar-companion-host';

type CompanionAction = 'start' | 'snooze' | 'dismiss';

function removeExisting() {
    document.getElementById(HOST_ID)?.remove();
}

async function showCompanion() {
    removeExisting();
    const stored = await chrome.storage.local.get(['avatar_data_url']);
    const avatar = typeof stored.avatar_data_url === 'string' ? stored.avatar_data_url : null;
    if (!avatar) return;

    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = 'all:initial;position:fixed;right:20px;bottom:16px;z-index:2147483647;pointer-events:auto;';
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = `
        <style>
            * { box-sizing: border-box; }
            .buddy { display:flex; align-items:flex-end; gap:10px; font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; animation:enter .85s cubic-bezier(.18,.9,.2,1) both; }
            .bubble { width:240px; padding:14px; border:1px solid #ddd6fe; border-radius:20px 20px 4px 20px; background:#fff; box-shadow:0 14px 45px rgba(30,41,59,.25); color:#1e1b4b; }
            .title { margin:0; font-size:14px; line-height:1.3; font-weight:800; }
            .copy { margin:4px 0 12px; font-size:11px; line-height:1.45; color:#64748b; }
            .actions { display:flex; gap:6px; flex-wrap:wrap; }
            button { border:0; border-radius:10px; padding:8px 10px; font:700 10px/1 Inter,-apple-system,sans-serif; cursor:pointer; }
            .start { color:#fff; background:#4f46e5; }
            .snooze { color:#4338ca; background:#eef2ff; }
            .dismiss { color:#64748b; background:#f1f5f9; }
            img { width:112px; height:168px; object-fit:contain; filter:drop-shadow(0 12px 12px rgba(15,23,42,.28)); animation:idle 3.2s ease-in-out 1s infinite; transform-origin:50% 100%; }
            .leaving-right { animation:exitRight .55s ease-in both; }
            .leaving-down { animation:exitDown .55s ease-in both; }
            .celebrate img { animation:celebrate .55s ease-in-out both; }
            @keyframes enter { from { transform:translateX(380px); opacity:0; } 55% { transform:translateX(-10px) translateY(-4px); opacity:1; } 75% { transform:translateX(5px); } to { transform:none; opacity:1; } }
            @keyframes idle { 0%,100% { transform:translateY(0) rotate(0); } 50% { transform:translateY(-5px) rotate(1.5deg); } }
            @keyframes celebrate { 0%,100% { transform:translateY(0) rotate(0); } 40% { transform:translateY(-18px) rotate(-5deg); } 70% { transform:translateY(-5px) rotate(5deg); } }
            @keyframes exitRight { to { transform:translateX(390px); opacity:0; } }
            @keyframes exitDown { to { transform:translateY(210px); opacity:0; } }
            @media (max-width:520px) { .bubble { width:190px; } img { width:86px; height:130px; } }
            @media (prefers-reduced-motion:reduce) { .buddy,img { animation:none!important; } }
        </style>
        <div class="buddy" role="dialog" aria-label="Microbreak reminder">
            <div class="bubble">
                <p class="title">Ready for a 2-minute reset?</p>
                <p class="copy">Your break buddy is here to stretch with you.</p>
                <div class="actions">
                    <button class="start" data-action="start">Start break</button>
                    <button class="snooze" data-action="snooze">Snooze 5m</button>
                    <button class="dismiss" data-action="dismiss">Not now</button>
                </div>
            </div>
            <img alt="Your Microbreaks companion" />
        </div>`;
    const image = root.querySelector('img');
    if (image) image.setAttribute('src', avatar);

    const leave = (action: CompanionAction) => {
        const buddy = root.querySelector('.buddy');
        if (!buddy) return;
        if (action === 'start') buddy.classList.add('celebrate');
        const title = root.querySelector('.title');
        if (title) title.textContent = action === 'start' ? 'Let’s go! ✨' : action === 'snooze' ? 'See you in 5 minutes!' : 'No problem—keep listening to your body.';
        root.querySelector('.actions')?.remove();
        setTimeout(() => buddy.classList.add(action === 'snooze' ? 'leaving-down' : 'leaving-right'), action === 'start' ? 500 : 250);
        setTimeout(() => host.remove(), 1150);
        chrome.runtime.sendMessage({ action: action === 'start' ? 'AVATAR_START_BREAK' : action === 'snooze' ? 'AVATAR_SNOOZE' : 'AVATAR_DISMISS' });
    };
    root.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach(button => {
        button.addEventListener('click', () => leave(button.dataset.action as CompanionAction));
    });
    document.documentElement.appendChild(host);
    setTimeout(() => {
        if (document.getElementById(HOST_ID)) leave('dismiss');
    }, 30_000);
}

chrome.runtime.onMessage.addListener(message => {
    if (message?.action === 'SHOW_AVATAR_REMINDER') showCompanion();
});
