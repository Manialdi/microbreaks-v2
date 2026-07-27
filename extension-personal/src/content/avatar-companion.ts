import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { retargetClip } from 'three/examples/jsm/utils/SkeletonUtils.js';

const HOST_ID = 'microbreaks-avatar-companion-host';

type CompanionAction = 'start' | 'snooze' | 'dismiss';

function removeExisting() {
    document.getElementById(HOST_ID)?.remove();
}

function companionMarkup(characterMarkup: string) {
    return `
        <style>
            * { box-sizing:border-box; }
            .buddy { display:flex;align-items:flex-end;gap:10px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
            .bubble { width:225px;padding:14px;border:1px solid #ddd6fe;border-radius:20px 20px 4px 20px;background:#fff;box-shadow:0 14px 45px rgba(30,41,59,.25);color:#1e1b4b;opacity:0;transform:translateY(8px) scale(.98);animation:revealBubble .28s ease-out 6.05s both; }
            .title { margin:0;font-size:14px;line-height:1.3;font-weight:800; }
            .copy { margin:4px 0 12px;font-size:11px;line-height:1.45;color:#64748b; }
            .actions { display:flex;gap:6px;flex-wrap:wrap; }
            button { border:0;border-radius:10px;padding:8px 10px;font:700 10px/1 Inter,-apple-system,sans-serif;cursor:pointer;opacity:0;transform:translateY(6px);animation:revealAction .24s ease-out both; }
            button:nth-child(1) { animation-delay:6.25s; } button:nth-child(2) { animation-delay:6.33s; } button:nth-child(3) { animation-delay:6.41s; }
            .start { color:#fff;background:#4f46e5; }.snooze { color:#4338ca;background:#eef2ff; }.dismiss { color:#64748b;background:#f1f5f9; }
            .stage { width:145px;height:225px;position:relative;flex:none;filter:drop-shadow(0 10px 9px rgba(15,23,42,.22));transform-origin:50% 100%; }
            .stage.walking-in { animation:walkAcross 2.2s linear both; }
            .stage.leaving { animation:walkOut .9s ease-in both; }
            .sprite-stage { width:112px;height:176px;position:relative;flex:none;filter:drop-shadow(0 10px 9px rgba(15,23,42,.2));overflow:hidden; }
            .sprite-stage.entering { animation:spriteTravel 5s linear both; }
            .sprite-stage.leaving { animation:spriteExit 5s linear both; }
            .sprite { width:100%;height:100%;background-repeat:no-repeat;background-size:800% 100%;background-position:0 0;image-rendering:pixelated; }
            .sprite.walking { animation:spriteWalk 1.05s steps(7,end) infinite; }
            .sprite.returning { transform:scaleX(-1); }
            .sprite.stopped { animation:none;background-position:42.857% 0; }
            .sprite.turning { background-size:400% 100%;animation:spriteTurn .8s steps(3,end) both; }
            .sprite.facing { animation:none;background-size:400% 100%;background-position:100% 0; }
            canvas { width:100%!important;height:100%!important;display:block; }
            .flat-avatar { width:112px;height:168px;object-fit:contain;filter:drop-shadow(0 12px 12px rgba(15,23,42,.28));animation:flatIn 1.45s ease-out both; }
            .celebrate .stage { animation:celebrate .55s ease-in-out both; }
            @keyframes walkAcross { from { transform:translateX(260px);opacity:1; } to { transform:none;opacity:1; } }
            @keyframes walkOut { to { transform:translateX(330px);opacity:0; } }
            @keyframes spriteTravel { from { transform:translateX(520px); } to { transform:translateX(-45px); } }
            @keyframes spriteExit { from { transform:translateX(-45px); } to { transform:translateX(520px); } }
            @keyframes spriteWalk { from { background-position:0 0; } to { background-position:100% 0; } }
            @keyframes spriteTurn { from { background-position:0 0; } to { background-position:100% 0; } }
            @keyframes flatIn { from { transform:translateX(220px);opacity:0; } to { transform:none;opacity:1; } }
            @keyframes revealBubble { to { opacity:1;transform:none; } }
            @keyframes revealAction { to { opacity:1;transform:none; } }
            @keyframes celebrate { 0%,100% { transform:none; } 45% { transform:translateY(-18px) rotate(-3deg); } }
            @media (max-width:520px) { .bubble { width:190px; }.stage { width:125px;height:200px; } }
            @media (prefers-reduced-motion:reduce) { .stage,.sprite-stage,.sprite,.bubble,button,.flat-avatar { animation:none!important;opacity:1;transform:none; } }
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
            ${characterMarkup}
        </div>`;
}

function wireActions(host: HTMLDivElement, root: ShadowRoot, cleanup?: () => void) {
    let leaving = false;
    const leave = (action: CompanionAction) => {
        if (leaving) return;
        leaving = true;
        const buddy = root.querySelector('.buddy');
        const stage = root.querySelector('.stage, .sprite-stage');
        if (action === 'start') buddy?.classList.add('celebrate');
        const title = root.querySelector('.title');
        const copy = root.querySelector('.copy');
        if (action === 'start') {
            if (title) title.textContent = 'Let’s go! ✨';
            if (copy) copy.textContent = 'Opening your stretch now.';
        } else if (action === 'snooze') {
            if (title) title.textContent = 'See you in 5 minutes!';
            if (copy) copy.textContent = 'I’ll remind you again soon.';
        } else {
            if (title) title.textContent = 'No problem - keep listening to your body.';
            if (copy) copy.textContent = 'Your next break stays on schedule.';
        }
        root.querySelector('.actions')?.remove();
        setTimeout(() => {
            const sprite = root.querySelector('.sprite');
            sprite?.classList.remove('stopped', 'turning', 'facing');
            if (sprite instanceof HTMLElement && sprite.dataset.walkSheet) {
                sprite.style.backgroundImage = `url('${sprite.dataset.walkSheet}')`;
            }
            sprite?.classList.add('walking', 'returning');
            stage?.classList.add('leaving');
        }, action === 'start' ? 500 : 250);
        setTimeout(() => { cleanup?.(); host.remove(); }, 5600);
        chrome.runtime.sendMessage({ action: action === 'start' ? 'AVATAR_START_BREAK' : action === 'snooze' ? 'AVATAR_SNOOZE' : 'AVATAR_DISMISS' });
    };
    root.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach(button => button.addEventListener('click', () => leave(button.dataset.action as CompanionAction)));
    setTimeout(() => document.getElementById(HOST_ID) && leave('dismiss'), 30_000);
}

async function showSpriteCompanion() {
    const saved = await chrome.storage.local.get(['avatar_walk_sheet_url', 'avatar_turn_sheet_url']);
    const spriteUrl = typeof saved.avatar_walk_sheet_url === 'string' ? saved.avatar_walk_sheet_url : chrome.runtime.getURL('assets/companion/walk-sheet.png');
    const turnUrl = typeof saved.avatar_turn_sheet_url === 'string' ? saved.avatar_turn_sheet_url : chrome.runtime.getURL('assets/companion/turn-sheet.png');
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = 'all:initial;position:fixed;right:20px;bottom:16px;z-index:2147483647;pointer-events:auto;';
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = companionMarkup(`
        <div class="sprite-stage entering" aria-label="Your Microbreaks companion walking in">
            <div class="sprite walking" data-walk-sheet="${spriteUrl}" style="background-image:url('${spriteUrl}')"></div>
        </div>
    `);
    wireActions(host, root);
    document.documentElement.appendChild(host);

    window.setTimeout(() => {
        const sprite = root.querySelector('.sprite');
        sprite?.classList.remove('walking');
        if (sprite instanceof HTMLElement) sprite.style.backgroundImage = `url('${turnUrl}')`;
        sprite?.classList.add('turning');
    }, 5000);
    window.setTimeout(() => {
        const sprite = root.querySelector('.sprite');
        sprite?.classList.remove('turning');
        sprite?.classList.add('facing');
    }, 5800);
}

function findBone(model: THREE.Object3D, endings: string[]) {
    let result: THREE.Bone | undefined;
    model.traverse(object => {
        if (result || !(object instanceof THREE.Bone)) return;
        const normalized = object.name.toLowerCase().replace(/[^a-z]/g, '');
        if (endings.some(ending => normalized.endsWith(ending))) result = object;
    });
    return result;
}

function findSkinnedMesh(model: THREE.Object3D) {
    let result: THREE.SkinnedMesh | undefined;
    model.traverse(object => {
        if (!result && object instanceof THREE.SkinnedMesh) result = object;
    });
    return result;
}

function normalizedBoneName(name: string) {
    return name.toLowerCase().replace(/mixamorig|armature|[^a-z]/g, '');
}

function createBoneNameMap(target: THREE.SkinnedMesh, source: THREE.SkinnedMesh) {
    const sourceNames = new Map(source.skeleton.bones.map(bone => [normalizedBoneName(bone.name), bone.name]));
    const names: Record<string, string> = {};
    target.skeleton.bones.forEach(bone => {
        const match = sourceNames.get(normalizedBoneName(bone.name));
        if (match) names[bone.name] = match;
    });
    return names;
}

async function show3DCompanion(modelUrl: string) {
    const loader = new GLTFLoader();
    const [gltf, motionGltf] = await Promise.all([
        loader.loadAsync(modelUrl),
        loader.loadAsync(chrome.runtime.getURL('assets/animations/humanoid-motion.glb')),
    ]);

    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = 'all:initial;position:fixed;right:20px;bottom:10px;z-index:2147483647;pointer-events:auto;';
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = companionMarkup('<div class="stage walking-in"><canvas aria-label="Your animated Microbreaks companion"></canvas></div>');
    const canvas = root.querySelector('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('3D canvas was not created.');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(145, 225, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(27, 145 / 225, 0.1, 100);
    camera.position.set(0, 1.35, 6.2);
    camera.lookAt(0, 1.3, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x64748b, 2.8));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(3, 5, 4);
    scene.add(key);

    const model = gltf.scene;
    const initialBox = new THREE.Box3().setFromObject(model);
    const initialSize = initialBox.getSize(new THREE.Vector3());
    const scale = 2.75 / Math.max(initialSize.y, 0.001);
    model.scale.setScalar(scale);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -box.min.y, -center.z);
    const walkingYaw = -Math.PI / 2;
    const restingYaw = -0.08;
    model.rotation.y = walkingYaw;
    scene.add(model);

    const leftArm = findBone(model, ['leftarm', 'leftupperarm']);
    const rightArm = findBone(model, ['rightarm', 'rightupperarm']);
    const leftForeArm = findBone(model, ['leftforearm', 'leftlowerarm']);
    const rightForeArm = findBone(model, ['rightforearm', 'rightlowerarm']);
    const leftHand = findBone(model, ['lefthand']);
    const rightHand = findBone(model, ['righthand']);

    const targetMesh = findSkinnedMesh(model);
    const sourceMesh = findSkinnedMesh(motionGltf.scene);
    const sourceWalk = motionGltf.animations.find(clip => /walk/i.test(clip.name));
    const sourceIdle = motionGltf.animations.find(clip => /idle/i.test(clip.name));
    let walkClip: THREE.AnimationClip | undefined;
    let idleClip: THREE.AnimationClip | undefined;
    if (targetMesh && sourceMesh) {
        const names = createBoneNameMap(targetMesh, sourceMesh);
        const hips = targetMesh.skeleton.bones.find(bone => /hips|pelvis/i.test(bone.name));
        const options = {
            names,
            hip: hips ? names[hips.name] : undefined,
            hipInfluence: new THREE.Vector3(0, 0, 0),
            useFirstFramePosition: true,
        };
        if (sourceWalk) walkClip = retargetClip(targetMesh, sourceMesh, sourceWalk, options);
        if (sourceIdle) idleClip = retargetClip(targetMesh, sourceMesh, sourceIdle, options);
    }
    idleClip ||= gltf.animations.find(clip => /idle|stand|neutral/i.test(clip.name)) || gltf.animations[0];
    const mixer = walkClip || idleClip ? new THREE.AnimationMixer(model) : undefined;
    let activeAction: THREE.AnimationAction | undefined;
    const playClip = (clip?: THREE.AnimationClip) => {
        if (!mixer || !clip) return;
        const next = mixer.clipAction(clip);
        if (next === activeAction) return;
        next.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(.16).play();
        activeAction?.fadeOut(.16);
        activeAction = next;
    };
    playClip(walkClip || idleClip);
    let frame = 0;
    const started = performance.now();
    const clock = new THREE.Clock();
    let settled = false;
    const animate = (now: number) => {
        frame = requestAnimationFrame(animate);
        const elapsed = (now - started) / 1000;
        mixer?.update(Math.min(clock.getDelta(), .05));

        if (!settled && elapsed >= 2.2) {
            settled = true;
            playClip(idleClip);
        }

        if (elapsed < 2.2) {
            // The reference character walks in profile. These restrained offsets
            // keep the hands visibly moving even when an avatar's retargeted clip
            // has weak upper-body tracks.
            const stride = Math.sin(elapsed * 8.6);
            if (leftArm) leftArm.rotation.x += stride * .24;
            if (rightArm) rightArm.rotation.x -= stride * .24;
            if (leftForeArm) leftForeArm.rotation.x += Math.max(0, -stride) * .1;
            if (rightForeArm) rightForeArm.rotation.x += Math.max(0, stride) * .1;
            if (leftHand) leftHand.rotation.z += stride * .045;
            if (rightHand) rightHand.rotation.z -= stride * .045;
            model.rotation.y = walkingYaw;
        } else {
            const turnProgress = THREE.MathUtils.smoothstep(Math.min((elapsed - 2.2) / .32, 1), 0, 1);
            model.rotation.y = THREE.MathUtils.lerp(walkingYaw, restingYaw, turnProgress);
        }
        renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    const cleanup = () => {
        cancelAnimationFrame(frame);
        mixer?.stopAllAction();
        renderer.dispose();
        model.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            object.geometry?.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach(material => material.dispose());
        });
    };
    wireActions(host, root, cleanup);
    document.documentElement.appendChild(host);
}

async function showFlatCompanion(avatar: string) {
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = 'all:initial;position:fixed;right:20px;bottom:16px;z-index:2147483647;pointer-events:auto;';
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = companionMarkup('<img class="flat-avatar" alt="Your Microbreaks companion" />');
    root.querySelector('img')?.setAttribute('src', avatar);
    wireActions(host, root);
    document.documentElement.appendChild(host);
}

async function showCompanion() {
    removeExisting();
    await showSpriteCompanion();
    return true;
}

async function showSessionOutcome(kind: 'early' | 'complete') {
    removeExisting();
    const host = document.createElement('div');
    host.id = HOST_ID;
    host.style.cssText = 'all:initial;position:fixed;right:0;bottom:18px;z-index:2147483647;pointer-events:none;';
    const root = host.attachShadow({ mode: 'closed' });
    const key = kind === 'complete' ? 'avatar_complete_lean_url' : 'avatar_early_lean_url';
    const saved = await chrome.storage.local.get(key);
    const imageUrl = typeof saved[key] === 'string' ? saved[key] : chrome.runtime.getURL(`assets/companion/${kind === 'complete' ? 'complete-lean' : 'early-lean'}.png`);
    const message = kind === 'complete' ? 'You did great! 👍' : 'No worries - let’s finish next time.';
    root.innerHTML = `
        <style>
            * { box-sizing:border-box; }
            .outcome { display:flex;align-items:center;gap:4px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:leanIn .38s ease-out both,leanOut .38s ease-in 4s both; }
            .message { max-width:230px;padding:12px 15px;border:1px solid #ddd6fe;border-radius:18px;background:#fff;box-shadow:0 14px 40px rgba(30,41,59,.24);color:#312e81;font-size:13px;line-height:1.35;font-weight:800; }
            img { width:auto;height:205px;display:block;object-fit:contain;filter:drop-shadow(0 10px 10px rgba(15,23,42,.2)); }
            @keyframes leanIn { from { transform:translateX(145px); } to { transform:none; } }
            @keyframes leanOut { to { transform:translateX(145px); } }
            @media (max-width:520px) { .message { max-width:190px;font-size:12px; } img { width:auto;height:170px; } }
            @media (prefers-reduced-motion:reduce) { .outcome { animation:none; } }
        </style>
        <div class="outcome" role="status" aria-live="polite">
            <div class="message">${message}</div>
            <img src="${imageUrl}" alt="Your Microbreaks buddy" />
        </div>`;
    document.documentElement.appendChild(host);
    window.setTimeout(() => host.remove(), 4500);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.action === 'SHOW_SESSION_OUTCOME') {
        const kind = message.kind === 'complete' ? 'complete' : 'early';
        showSessionOutcome(kind).then(() => sendResponse({ shown: true })).catch(error => {
            sendResponse({ shown: false, error: error instanceof Error ? error.message : String(error) });
        });
        return true;
    }
    if (message?.action !== 'SHOW_AVATAR_REMINDER') return;
    showCompanion().then(shown => sendResponse({ shown })).catch(error => {
        console.error('[Avatar] Could not render companion.', error);
        sendResponse({ shown: false, error: error instanceof Error ? error.message : String(error) });
    });
    return true;
});
