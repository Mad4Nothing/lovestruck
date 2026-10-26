import { useState } from 'react';
import type { Shade,Tone } from '@/data/quiz';
import { LipArt } from '@/components/lip-art';
export function Swatch({shade,tone}:{shade:Shade;tone:Tone}) {
 const [fallback,setFallback]=useState(0);
 return <div className="swatch" style={{color:shade.placeholderHex}}>{fallback<2?<img width={240} height={140} src={fallback===0?`/assets/swatches/${shade.id}-${tone}.webp`:`/assets/swatches/${shade.id}.webp`} alt={`${shade.name} lipstick swatch`} onError={()=>setFallback(v=>v+1)}/>:<LipArt color={shade.placeholderHex}/>}<span>Illustrative colour · not a real swatch</span></div>;
}
