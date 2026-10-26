export type Palette = 'nude' | 'red' | 'pink';
export type Tone = 'fair' | 'medium' | 'deep' | 'any';
export type Shade = { id: string; name: string; palette: Palette; tagline: string; sku: number | null; inStock: boolean; placeholderHex: string; skinToneFit?: Partial<Record<Tone, number>> };
// Approximate colour chips only: replace with real swatch photos.
export const shades: Shade[] = [
    ['bare-minimum', 'Bare Minimum', 'nude', 'For the less-is-more romantic', '#b88a7b'],
    ['caramel-drip', 'Caramel Drip', 'nude', 'For the sweet talker', '#ab7052'],
    ['latte-love', 'Latte Love', 'nude', 'For the warm, comforting crush', '#a27b68'],
    ['soft-girl-era', 'Soft Girl Era', 'nude', 'For the hopeless romantic', '#ba7e81'],
    ['brown-baddie', 'Brown Baddie', 'nude', 'For the confident heartbreaker', '#815144'],
    ['espresso-yourself', 'Espresso Yourself', 'nude', 'For the bold, mysterious slow burn', '#5e3d36'],
    ['be-wine', 'Be Wine', 'red', 'For the sophisticated flirt', '#803546'],
    ['red-my-mind', 'Red My Mind', 'red', 'For the unapologetic main character', '#b62e43'],
    ['ruby-boo', 'Ruby Boo', 'red', 'For the classic romantic with a fiery side', '#9c293e'],
    ['berry-sweet', 'Berry Sweet', 'pink', 'For the sweet-on-you romantic', '#a44270'],
    ['pinky-promise', 'Pinky Promise', 'pink', 'For the playful, forever-you girl', '#cb6e8d'],
    ['pretty-problem', 'Pretty Problem', 'pink', 'For the flirt who loves a little drama', '#ba4269'],
].map(([id, name, palette, tagline, placeholderHex]) => ({ id, name, palette: palette as Palette, tagline, placeholderHex, sku: id === 'bare-minimum' ? 26701647 : null, inStock: id !== 'bare-minimum' }));
export type Option = { id: string; label: string; description?: string; palette?: Palette; shadeId?: string; tone?: Tone };
export const questions: { id: string; title: string; helper: string; options: Option[] }[] = [
    {
        id: 'q1', title: 'If you had to describe yourself in one word, what would it be?', helper: 'Your personality says a lot about your lipstick soulmate', options: [
            { id: 'q1a', label: 'Soft Girl Era', description: 'Romantic, effortless and a little dreamy.', palette: 'nude', shadeId: 'soft-girl-era' },
            { id: 'q1b', label: 'Red My Mind', description: 'Bold, confident and born to turn heads.', palette: 'red', shadeId: 'red-my-mind' },
            { id: 'q1c', label: 'Brown Baddie', description: 'Mysterious, unapologetic and effortlessly cool.', palette: 'nude', shadeId: 'brown-baddie' },
            { id: 'q1d', label: 'Pretty Problem', description: 'Playful, flirty and a little hard to resist.', palette: 'pink', shadeId: 'pretty-problem' }]
    },
    {
        id: 'q2', title: "What's your complexion?", helper: "Your canvas, your rules. Let's find a shade that makes you feel amazing", options: [
            { id: 'q2a', label: 'Fair to light', tone: 'fair' }, { id: 'q2b', label: 'Medium to wheatish', tone: 'medium' }, { id: 'q2c', label: 'Dusky to deep', tone: 'deep' }, { id: 'q2d', label: 'Somewhere in between - I wear what I love!', tone: 'any' }]
    },
    {
        id: 'q3', title: "What's your favourite colour palette?", helper: 'Pick your kind of love at first swipe', options: [
            { id: 'q3a', label: 'Browns & Nudes', description: 'Bare Minimum, Caramel Drip, Latte Love, Soft Girl Era, Brown Baddie, Espresso Yourself', palette: 'nude' },
            { id: 'q3b', label: 'Reds', description: 'Be Wine, Red My Mind, Ruby Boo', palette: 'red' },
            { id: 'q3c', label: 'Pinks', description: 'Berry Sweet, Pinky Promise, Pretty Problem', palette: 'pink' }]
    },
    {
        id: 'q4', title: 'Are you experimental with your lipstick choices?', helper: 'Tell us how adventurous this love story gets', options: [
            { id: 'q4a', label: "Not really! Bare Minimum is more my style", palette: 'nude', shadeId: 'bare-minimum' },
            { id: 'q4b', label: "A little! I need some help to Espresso myself", palette: 'nude', shadeId: 'caramel-drip' },
            { id: 'q4c', label: "Absolutely! You Red My Mind", palette: 'red', shadeId: 'red-my-mind' },
            { id: 'q4d', label: "Always! I'm ready for a Pretty Problem", palette: 'pink', shadeId: 'pretty-problem' }]
    }
];
export const results = {
    nude: { title: 'The Nude Crush', label: 'Browns & Nudes', body: "You're the effortless kind of love. A little understated, a lot unforgettable. You don't need grand gestures when you've got great taste.", closer: 'Your perfect match? A shade that feels like you, only a little more irresistible.', note: 'Low effort. High attraction. Swipe love at first swipe.' },
    red: { title: 'The Red Romance', label: 'Reds', body: "You're passion with a pulse. Confident, magnetic and never one to wait for a first move. You walk in, turn heads and leave a little lipstick-shaped memory behind.", closer: '', note: 'Warning: may cause love at first swipe.' },
    pink: { title: 'The Pink Affair', label: 'Pinks & Berries', body: "You're flirty, fun and never afraid to wear your heart on your lips. Sweet? Sometimes. Innocent? Not always. You know exactly how to make an impression.", closer: '', note: 'Pretty in pink. Trouble in every swipe.' }
};
