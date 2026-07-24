import { useEffect, useRef, useState } from 'react';
import { Camera, Check, ChevronLeft, RefreshCw, Sparkles, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AvatarStyle = 'illustrated' | 'soft-3d' | 'pixel' | 'chibi';
type Presentation = 'match' | 'feminine' | 'masculine' | 'neutral';

const STYLES: { id: AvatarStyle; label: string; image: string }[] = [
    { id: 'illustrated', label: 'Flat 2D', image: 'assets/avatar-styles/illustrated.png' },
    { id: 'soft-3d', label: 'Soft 3D', image: 'assets/avatar-styles/soft-3d.png' },
    { id: 'pixel', label: 'Pixel companion', image: 'assets/avatar-styles/pixel.png' },
    { id: 'chibi', label: 'Chibi 2D', image: 'assets/avatar-styles/chibi.png' },
];

export default function AvatarStudio({ onClose, onSaved }: { onClose: () => void; onSaved: (avatar: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState<'style' | 'photo' | 'choices'>('style');
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
        supabase.auth.getUser().then(({ data }) => {
            setBatchesUsed(Number(data.user?.app_metadata?.avatar_generation_batches || 0));
        });
    }, []);

    const selectPhoto = (file?: File) => {
        setError('');
        if (!file) return;
        if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
        if (file.size > 8 * 1024 * 1024) return setError('Please choose a photo under 8 MB.');
        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(String(reader.result));
            setPhotoFile(file);
        };
        reader.onerror = () => setError('We could not read that photo.');
        reader.readAsDataURL(file);
    };

    const generate = async () => {
        if (!photoFile || batchesUsed >= 2) return;
        setBusy(true);
        setError('');
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData.session?.access_token;
            if (!token) throw new Error('Please sign in again.');
            const body = new FormData();
            body.append('photo', photoFile);
            body.append('style', style);
            body.append('presentation', presentation);
            const response = await fetch('https://www.micro-breaks.com/api/avatar/generate', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body,
            });
            const result = await response.json() as { avatars?: string[]; batchesUsed?: number; error?: string };
            if (!response.ok || !result.avatars || result.avatars.length !== 2) {
                throw new Error(result.error || 'Avatar generation failed.');
            }
            const nextCount = Number(result.batchesUsed || batchesUsed + 1);
            setChoices(result.avatars);
            setSelected(0);
            setBatchesUsed(nextCount);
            setStep('choices');
        } catch (generationError) {
            setError(generationError instanceof Error ? generationError.message : 'Avatar generation failed. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    const saveAvatar = async () => {
        const avatar = choices[selected];
        if (!avatar) return;
        await chrome.storage.local.set({
            avatar_data_url: avatar,
            avatar_style: style,
            avatar_presentation: presentation,
        });
        onSaved(avatar);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm p-3 flex items-center justify-center">
            <div className="w-full max-h-[94vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white/95 border-b border-gray-100 rounded-t-3xl">
                    <button onClick={step === 'style' ? onClose : () => setStep(step === 'choices' ? 'photo' : 'style')} className="p-2 rounded-full hover:bg-gray-100" aria-label="Back">
                        {step === 'style' ? <X size={18} /> : <ChevronLeft size={18} />}
                    </button>
                    <div className="text-center">
                        <p className="text-sm font-black text-gray-900">Create your break buddy</p>
                        <p className="text-[10px] text-gray-500">AI avatar creator</p>
                    </div>
                    <div className="w-9" />
                </div>

                <div className="p-4">
                    {step === 'style' && <>
                        <div className="mb-4">
                            <h2 className="text-lg font-black text-gray-900">Choose a look first</h2>
                            <p className="text-xs text-gray-500 mt-1">Preview the full-body styles suited to animation.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {STYLES.map(item => (
                                <button key={item.id} onClick={() => setStyle(item.id)} className={`relative rounded-2xl overflow-hidden border-2 text-left transition ${style === item.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'}`}>
                                    <img src={chrome.runtime.getURL(item.image)} alt="" className="aspect-square w-full object-contain bg-violet-50" />
                                    <span className="block px-2 py-2 text-[11px] font-bold bg-white">{item.label}</span>
                                    {style === item.id && <span className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center"><Check size={14} /></span>}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep('photo')} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold">Continue</button>
                    </>}

                    {step === 'photo' && <>
                        <h2 className="text-lg font-black text-gray-900">Add a clear photo</h2>
                        <p className="text-xs text-gray-500 mt-1">A clear, front-facing full-length photo works best. Half-body is accepted; the AI service will complete the body. You confirm you have permission to use this photo.</p>

                        <button onClick={() => inputRef.current?.click()} className="mt-4 w-full min-h-52 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 flex flex-col items-center justify-center overflow-hidden">
                            {photo ? <img src={photo} alt="Selected full photo" className="w-full h-64 object-contain bg-slate-100" /> : <><span className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow"><Camera /></span><span className="mt-3 text-sm font-bold text-indigo-700">Choose full-length photo</span><span className="text-[10px] text-gray-500 mt-1">JPG, PNG or WebP · Max 8 MB</span></>}
                        </button>
                        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => selectPhoto(event.target.files?.[0])} />

                        <label className="block mt-4 text-[10px] font-bold uppercase text-gray-500">Avatar presentation (optional)</label>
                        <select value={presentation} onChange={event => setPresentation(event.target.value as Presentation)} className="mt-1 w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white">
                            <option value="match">Match my photo</option>
                            <option value="neutral">Neutral</option>
                            <option value="feminine">Feminine</option>
                            <option value="masculine">Masculine</option>
                        </select>

                        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
                        <div className="mt-4 flex items-start gap-2 text-[10px] text-emerald-800 bg-emerald-50 rounded-xl p-2.5"><Upload size={14} className="shrink-0 mt-0.5" /><span>Your photo is securely sent for this generation and is not stored by Microbreaks.</span></div>
                        <button disabled={!photo || busy || batchesUsed >= 2} onClick={generate} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 disabled:bg-gray-300 text-white text-sm font-bold flex items-center justify-center gap-2">
                            <Sparkles size={16} /> {busy ? 'Creating avatars…' : batchesUsed >= 2 ? 'Free generations used' : 'Create 2 AI avatars'}
                        </button>
                    </>}

                    {step === 'choices' && <>
                        <h2 className="text-lg font-black text-gray-900">Pick your buddy</h2>
                        <p className="text-xs text-gray-500 mt-1">This avatar will greet you in reminders and breaks.</p>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {choices.map((choice, index) => <button key={choice.slice(-24)} onClick={() => setSelected(index)} className={`relative rounded-2xl overflow-hidden border-2 ${selected === index ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'}`}>
                                <img src={choice} alt={`Avatar option ${index + 1}`} className="w-full aspect-[3/4] object-contain bg-violet-50" />
                                {selected === index && <span className="absolute top-2 right-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center"><Check size={16} /></span>}
                            </button>)}
                        </div>
                        <button onClick={saveAvatar} className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold">Use this avatar</button>
                        <button disabled={batchesUsed >= 2} onClick={() => setStep('photo')} className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold text-gray-600 disabled:text-gray-300 flex items-center justify-center gap-2"><RefreshCw size={14} />{batchesUsed >= 2 ? 'Free retry used' : 'Use my one free retry'}</button>
                    </>}
                </div>
            </div>
        </div>
    );
}
