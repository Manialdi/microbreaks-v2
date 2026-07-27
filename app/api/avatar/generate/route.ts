import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const maxDuration = 120;

const MAX_PHOTO_BYTES = 6 * 1024 * 1024;
const MAX_BATCHES = 5;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_STYLES = new Set(['illustrated', 'soft-3d', 'pixel', 'chibi']);
const ALLOWED_PRESENTATIONS = new Set(['match', 'feminine', 'masculine', 'neutral']);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
};

const STYLE_PROMPTS: Record<string, string> = {
    illustrated: 'flat 2D cel-shaded character with clean outlines and simple color blocks',
    'soft-3d': 'soft stylized 3D character with simple rounded forms and polished materials',
    pixel: 'crisp modern pixel-art character with a readable silhouette and deliberate pixel clusters',
    chibi: 'friendly chibi 2D character with simplified proportions and clean animation-ready shapes',
};

function isSupportedImage(bytes: Uint8Array, mime: string) {
    if (mime === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (mime === 'image/png') return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    if (mime === 'image/webp') {
        return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
    }
    return false;
}

function safeJson(error: string, status: number) {
    return NextResponse.json({ error }, { status, headers: corsHeaders });
}

async function removeChromaBackground(base64Image: string) {
    const source = Buffer.from(base64Image, 'base64');
    const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const magentaStrength = Math.min(red, blue) - green;
        if (red > 150 && blue > 150 && magentaStrength > 55) {
            const alpha = magentaStrength >= 120 ? 0 : Math.round(255 * (120 - magentaStrength) / 65);
            data[index + 3] = Math.min(data[index + 3], alpha);
            // Reduce magenta fringing on antialiased edges.
            const neutralEdge = Math.max(green, Math.min(red, blue) - 20);
            data[index] = Math.min(red, neutralEdge);
            data[index + 2] = Math.min(blue, neutralEdge);
        }
    }
    const output = await sharp(data, { raw: info }).webp({ quality: 82, alphaQuality: 92 }).toBuffer();
    return output.toString('base64');
}

async function requestAvatar(apiKey: string, photo: File, prompt: string, userHash: string, size = '1024x1536') {
    const form = new FormData();
    form.append('model', 'gpt-image-2');
    form.append('image', photo, 'reference-image');
    form.append('prompt', prompt);
    form.append('size', size);
    form.append('quality', 'medium');
    form.append('output_format', 'webp');
    form.append('output_compression', '78');
    form.append('user', userHash);

    const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: AbortSignal.timeout(105_000),
        cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Image generation failed (${response.status})`);
    const result = await response.json() as { data?: Array<{ b64_json?: string }> };
    const image = result.data?.[0]?.b64_json;
    if (!image) throw new Error('Image generation returned no image');
    const transparentImage = await removeChromaBackground(image);
    return `data:image/webp;base64,${transparentImage}`;
}

export async function POST(request: NextRequest) {
    const openAiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_INDIVIDUAL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_INDIVIDUAL;
    if (!openAiKey || !supabaseUrl || !serviceRoleKey) return safeJson('Server configuration error', 500);

    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) return safeJson('Authentication required', 401);
    const accessToken = authorization.slice(7);
    if (accessToken.length < 20 || accessToken.length > 4096) return safeJson('Invalid authentication token', 401);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    const user = userData.user;
    if (userError || !user) return safeJson('Invalid or expired session', 401);

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return safeJson('Invalid upload', 400);
    }

    const stage = String(formData.get('stage') || 'character');
    const photo = stage === 'motion-pack' ? formData.get('avatar') : formData.get('photo');
    const style = String(formData.get('style') || '');
    const presentation = String(formData.get('presentation') || 'match');
    if (!(photo instanceof File)) return safeJson('A photo is required', 400);
    if (!ALLOWED_TYPES.has(photo.type) || photo.size < 1_000 || photo.size > MAX_PHOTO_BYTES) {
        return safeJson('Photo must be a JPG, PNG, or WebP under 6 MB', 400);
    }
    if (!ALLOWED_STYLES.has(style) || (stage === 'character' && !ALLOWED_PRESENTATIONS.has(presentation))) {
        return safeJson('Invalid avatar settings', 400);
    }

    const photoBytes = new Uint8Array(await photo.arrayBuffer());
    if (!isSupportedImage(photoBytes, photo.type)) return safeJson('Photo content does not match its file type', 400);
    const safePhoto = new File([photoBytes], photo.type === 'image/png' ? 'photo.png' : photo.type === 'image/webp' ? 'photo.webp' : 'photo.jpg', { type: photo.type });

    if (stage !== 'character' && stage !== 'motion-pack') return safeJson('Invalid generation stage', 400);

    if (stage === 'motion-pack') {
        const packsUsed = Number(user.app_metadata?.avatar_motion_packs || 0);
        if (!Number.isSafeInteger(packsUsed) || packsUsed >= MAX_BATCHES) return safeJson('Your free movement packs have been used', 429);
        const reservedPacks = packsUsed + 1;
        const { error: reservePackError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            app_metadata: { ...user.app_metadata, avatar_motion_packs: reservedPacks },
        });
        if (reservePackError) return safeJson('Could not reserve movement allowance', 503);

        const identityRule = `Use the supplied approved avatar as the exact character reference. Preserve the same face, hair, glasses, skin tone, outfit, body proportions, colors and ${STYLE_PROMPTS[style]} rendering in every frame. Use a perfectly flat uniform #FF00FF background with no floor, shadows, scenery, text, borders or watermark. Keep the complete body visible at the same scale and baseline in every frame. Do not use magenta on the character.`;
        const prompts = {
            walk: `${identityRule} Create one horizontal sprite sheet containing exactly 8 equal-width sequential frames, left to right, of this character performing an elegant slow side-profile walk toward the left. Natural alternating arm swing, small confident steps, upright posture, no dance moves. Each panel contains exactly one complete character.`,
            turn: `${identityRule} Create one horizontal sprite sheet containing exactly 4 equal-width sequential frames, left to right: side profile facing left, beginning to turn, three-quarter view, then standing front-facing toward the viewer. Arms rest naturally. Each panel contains exactly one complete character.`,
            early: `${identityRule} Create one full-body pose of the character leaning into view from behind the right edge, friendly and reassuring, one hand lightly holding the edge.`,
            complete: `${identityRule} Create one full-body pose of the character leaning into view from behind the right edge and giving a clear friendly thumbs-up toward the viewer.`,
        };
        const userHash = createHash('sha256').update(user.id).digest('hex').slice(0, 32);
        try {
            const [walk, turn, early, complete] = await Promise.all([
                requestAvatar(openAiKey, safePhoto, prompts.walk, userHash, '1536x1024'),
                requestAvatar(openAiKey, safePhoto, prompts.turn, userHash, '1536x1024'),
                requestAvatar(openAiKey, safePhoto, prompts.early, userHash),
                requestAvatar(openAiKey, safePhoto, prompts.complete, userHash),
            ]);
            return NextResponse.json({ motionPack: { walk, turn, early, complete }, packsUsed: reservedPacks }, { headers: corsHeaders });
        } catch {
            return safeJson('Movement generation could not be completed. Please try again later.', 502);
        }
    }

    const batchesUsed = Number(user.app_metadata?.avatar_generation_batches || 0);
    if (!Number.isSafeInteger(batchesUsed) || batchesUsed >= MAX_BATCHES) return safeJson('Your free avatar generations have been used', 429);

    // Reserve the batch before calling a paid service. app_metadata cannot be modified by extension users.
    const reservedCount = batchesUsed + 1;
    const { error: reserveError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        app_metadata: { ...user.app_metadata, avatar_generation_batches: reservedCount },
    });
    if (reserveError) return safeJson('Could not reserve generation allowance', 503);

    const presentationInstruction = presentation === 'match'
        ? 'Match the apparent presentation in the reference photo.'
        : `Use a ${presentation} character presentation.`;
    const basePrompt = `Transform the person in the supplied reference photo into a ${STYLE_PROMPTS[style]}. Preserve recognizable facial features, skin tone, approximate age, hairstyle, glasses, and other identity cues. ${presentationInstruction} Create one complete full-body character facing forward in a relaxed neutral standing pose. Show the entire body from hair to shoe soles, with both hands and both shoes visible. Keep arms slightly separated from the torso and legs slightly separated so the silhouette is suitable for animation. Use simple everyday clothing, a clean silhouette, and no handheld objects. Place the character on a perfectly flat, uniform solid #FF00FF magenta chroma-key background with no floor, shadows, gradients, texture, reflections, or lighting variation. Do not use magenta anywhere on the character. No text, logos, watermark, scenery, extra people, cropped limbs, or duplicate body parts.`;
    const prompts = [
        `${basePrompt} Variant A: prioritize the closest possible resemblance and conservative clothing interpretation.`,
        `${basePrompt} Variant B: keep identity equally recognizable but use a slightly more expressive face and a distinct coordinated clothing color palette.`,
    ];
    const userHash = createHash('sha256').update(user.id).digest('hex').slice(0, 32);

    try {
        const avatars = await Promise.all(prompts.map(prompt => requestAvatar(openAiKey, safePhoto, prompt, userHash)));
        return NextResponse.json({ avatars, batchesUsed: reservedCount, batchesRemaining: MAX_BATCHES - reservedCount }, { headers: corsHeaders });
    } catch {
        // Do not return provider details or log user images/tokens.
        return safeJson('Avatar generation could not be completed. Please try again later.', 502);
    }
}

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}
