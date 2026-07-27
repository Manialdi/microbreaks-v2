import { useEffect, useRef, useState } from 'react';
import { Camera, Check, ChevronLeft, Play, RefreshCw, Sparkles, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AvatarStyle = 'illustrated' | 'pixel' | 'chibi';
type Presentation = 'match' | 'feminine' | 'masculine' | 'neutral';
type Step = 'demo' | 'style' | 'photo' | 'choices' | 'motion' | 'ready';

const STYLES: { id: AvatarStyle; label: string; image: string }[] = [
    { id: 'illustrated', label: 'Flat 2D', image: 'assets/avatar-styles/illustrated.png' },
    { id: 'pixel', label: 'Pixel buddy', image: 'assets/avatar-styles/pixel.png' },
    { id: 'chibi', label: 'Chibi 2D', image: 'assets/avatar-styles/chibi.png' },
];

type MotionPack = { walk: string; turn: string; early: string; complete: string };

export default function AvatarStudio({ onClose, onSaved }: { onClose: () => void; onSaved: (avatar: string, kind?: 'image') => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<Step>('demo');
    const [style, setStyle] = useState<AvatarStyle>('illustrated');
    const [presentation, setPresentation] = useState<Presentation>('match');
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [choices, setChoices] = useState<string[]>([]);
    const [selected, setSelected] = useState(0);
    const [batchesUsed, setBatchesUsed] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setBatchesUsed(Number(data.user?.app_metadata?.avatar_generation_batches || 0)));
    }, []);

    const selectPhoto = (file?: File) => {
        setError('');
        if (!file) return;
        if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
        if (file.size > 6 * 1024 * 1024) return setError('Please choose a photo under 6 MB.');
        const reader = new FileReader();
        reader.onload = () => { setPhoto(String(reader.result)); setPhotoFile(file); };
        reader.onerror = () => setError('We could not read that photo.');
        reader.readAsDataURL(file);
    };

    const token = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session?.access_token) throw new Error('Please sign in again.');
        return data.session.access_token;
    };

    const generateCharacter = async () => {
        if (!photoFile || batchesUsed >= 2) return;
        setBusy(true); setError('');
        try {
            const body = new FormData();
            body.append('stage', 'character'); body.append('photo', photoFile);
            body.append('style', style); body.append('presentation', presentation);
            const response = await fetch('https://www.micro-breaks.com/api/avatar/generate', { method: 'POST', headers: { Authorization: `Bearer ${await token()}` }, body });
            const result = await response.json() as { avatars?: string[]; batchesUsed?: number; error?: string };
            if (!response.ok || !result.avatars?.length) throw new Error(result.error || 'Avatar generation failed.');
            setChoices(result.avatars); setSelected(0); setBatchesUsed(Number(result.batchesUsed || batchesUsed + 1)); setStep('choices');
        } catch (cause) { setError(cause instanceof Error ? cause.message : 'Avatar generation failed.'); }
        finally { setBusy(false); }
    };

    const generateMotionPack = async () => {
        const avatar = choices[selected];
        if (!avatar) return;
        setStep('motion'); setBusy(true); setError('');
        try {
            const avatarBlob = await (await fetch(avatar)).blob();
            const body = new FormData();
            body.append('stage', 'motion-pack');
            body.append('avatar', avatarBlob, 'approved-avatar.webp');
            body.append('style', style);
            const response = await fetch('https://www.micro-breaks.com/api/avatar/generate', { method: 'POST', headers: { Authorization: `Bearer ${await token()}` }, body });
            const result = await response.json() as { motionPack?: MotionPack; error?: string };
            if (!response.ok || !result.motionPack) throw new Error(result.error || 'Movement generation failed.');
            await chrome.storage.local.set({
                avatar_data_url: avatar,
                avatar_style: style,
                avatar_presentation: presentation,
                avatar_kind: 'sprite-2d',
                avatar_walk_sheet_url: result.motionPack.walk,
                avatar_turn_sheet_url: result.motionPack.turn,
                avatar_early_lean_url: result.motionPack.early,
                avatar_complete_lean_url: result.motionPack.complete,
            });
            onSaved(avatar, 'image'); setStep('ready');
        } catch (cause) { setError(cause instanceof Error ? cause.message : 'Movement generation failed.'); setStep('choices'); }
        finally { setBusy(false); }
    };

    const back = () => {
        if (step === 'demo') return onClose();
        if (step === 'style') return setStep('demo');
        if (step === 'photo') return setStep('style');
        if (step === 'choices') return setStep('photo');
        onClose();
    };

    return <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm p-3 flex items-center justify-center">
        <div className="w-full max-h-[94vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/95 border-b border-gray-100 rounded-t-3xl">
                <button onClick={back} className="p-2 rounded-full hover:bg-gray-100" aria-label="Back">{step === 'demo' ? <X size={18}/> : <ChevronLeft size={18}/>}</button>
                <div className="text-center"><p className="text-sm font-black text-gray-900">Create your break buddy</p><p className="text-[10px] text-gray-500">Personal 2D animation</p></div><div className="w-9"/>
            </div>
            <div className="p-4">
                {step === 'demo' && <>
                    <h2 className="text-lg font-black">See what your buddy will do</h2>
                    <p className="mt-1 text-xs text-gray-500">It walks in, turns toward you, waits for your choice, and walks away.</p>
                    <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 p-5 text-center">
                        <img src={chrome.runtime.getURL('assets/avatar-styles/pixel.png')} className="mx-auto h-48 object-contain" alt="Animated buddy example"/>
                        <button onClick={() => chrome.runtime.sendMessage({ action: 'PREVIEW_AVATAR_REMINDER' })} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow"><Play size={15}/> Preview entrance</button>
                    </div>
                    <button onClick={() => setStep('style')} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold">Create mine</button>
                </>}
                {step === 'style' && <>
                    <h2 className="text-lg font-black">Choose one animation style</h2><p className="mt-1 text-xs text-gray-500">Your character and every movement will use this same look.</p>
                    <div className="grid grid-cols-3 gap-2 mt-4">{STYLES.map(item => <button key={item.id} onClick={() => setStyle(item.id)} className={`relative overflow-hidden rounded-2xl border-2 ${style === item.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'}`}><img src={chrome.runtime.getURL(item.image)} className="aspect-[3/4] w-full object-contain bg-violet-50" alt=""/><span className="block p-2 text-[10px] font-bold">{item.label}</span>{style === item.id && <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white"><Check size={14}/></span>}</button>)}</div>
                    <button onClick={() => setStep('photo')} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold">Continue</button>
                </>}
                {step === 'photo' && <>
                    <h2 className="text-lg font-black">Upload a clear photo</h2><p className="mt-1 text-xs text-gray-500">Front-facing is best. Full-length or half-body both work. Only upload a photo you have permission to use.</p>
                    <button onClick={() => inputRef.current?.click()} className="mt-4 w-full min-h-52 overflow-hidden rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 flex flex-col items-center justify-center">{photo ? <img src={photo} className="h-64 w-full object-contain bg-slate-100" alt="Selected full photo"/> : <><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow"><Camera/></span><span className="mt-3 text-sm font-bold text-indigo-700">Choose photo</span><span className="mt-1 text-[10px] text-gray-500">JPG, PNG or WebP · Max 6 MB</span></>}</button>
                    <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e => selectPhoto(e.target.files?.[0])}/>
                    <label className="block mt-4 text-[10px] font-bold uppercase text-gray-500">Character presentation (optional)</label>
                    <select value={presentation} onChange={e => setPresentation(e.target.value as Presentation)} className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs"><option value="match">Match the photo</option><option value="masculine">Masculine</option><option value="feminine">Feminine</option><option value="neutral">Neutral</option></select>
                    <p className="mt-1 text-[10px] text-gray-400">This only guides the character’s visual presentation; it is not asking for the person’s gender identity.</p>
                    {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
                    <div className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-2.5 text-[10px] text-emerald-800"><Upload size={14}/><span>The photo is sent securely for generation and is not stored by Microbreaks.</span></div>
                    <button disabled={!photo || busy || batchesUsed >= 2} onClick={generateCharacter} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 disabled:bg-gray-300 text-white text-sm font-bold flex justify-center gap-2"><Sparkles size={16}/>{busy ? 'Creating previews…' : batchesUsed >= 2 ? 'Free generations used' : 'Generate 2 previews'}</button>
                </>}
                {step === 'choices' && <>
                    <h2 className="text-lg font-black">Choose your character</h2><p className="mt-1 text-xs text-gray-500">After approval, we’ll create its walk, turn and session-ending poses.</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">{choices.map((choice, i) => <button key={i} onClick={() => setSelected(i)} className={`relative overflow-hidden rounded-2xl border-2 ${selected === i ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'}`}><img src={choice} className="aspect-[3/4] w-full object-contain bg-violet-50" alt={`Avatar option ${i + 1}`}/>{selected === i && <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white"><Check size={16}/></span>}</button>)}</div>
                    {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
                    <button onClick={generateMotionPack} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold">Approve & create movements</button>
                    <button disabled={batchesUsed >= 2} onClick={() => setStep('photo')} className="mt-2 w-full py-2.5 text-xs font-bold text-gray-600 disabled:text-gray-300 flex justify-center gap-2"><RefreshCw size={14}/>{batchesUsed >= 2 ? 'Free retry used' : 'Try another photo'}</button>
                </>}
                {step === 'motion' && <div className="py-16 text-center"><RefreshCw className="mx-auto animate-spin text-indigo-600"/><h2 className="mt-5 text-lg font-black">Creating your movement pack</h2><p className="mt-2 text-xs text-gray-500">Generating a consistent walk, turn and two ending poses. This usually takes 1–3 minutes.</p></div>}
                {step === 'ready' && <div className="py-10 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check size={32}/></span><h2 className="mt-4 text-xl font-black">Your buddy is ready</h2><p className="mt-2 text-xs text-gray-500">The same personalized character will now appear throughout the reminder sequence.</p><button onClick={() => chrome.runtime.sendMessage({ action: 'PREVIEW_AVATAR_REMINDER' })} className="mt-5 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold">Preview entrance</button><button onClick={onClose} className="mt-2 w-full py-2.5 text-xs font-bold text-gray-600">Back to dashboard</button></div>}
            </div>
        </div>
    </div>;
}
