import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { LipArt } from '@/components/lip-art';
import { Confetti } from '@/components/confetti';
import { results } from '@/data/quiz';
import type { QuizResult } from '@/lib/scoring';

export function MatchTransition({screen,result,onNext}:{screen:'loading'|'reveal';result:QuizResult;onNext:()=>void}) {
 const [imgError, setImgError] = useState(false);
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer=setTimeout(onNext,reduced?0:screen==='loading'?1500:5000);
  return ()=>clearTimeout(timer);
 },[screen,onNext]);

 return <section className={`transition-screen ${screen} relative overflow-hidden`} aria-live="polite">
  {screen==='loading'?(
   <>
    <div className="chemistry-lipstick-wrap">
     <img
      src="/nykaa-lipstick.png"
      alt="Lovestruck Lipstick"
      className="chemistry-lipstick-img"
      width={96}
      height={200}
      loading="eager"
     />
    </div>
    <h2>Checking your chemistry...</h2>
    <p>Finding your lip soulmate</p>
   </>
  ):(
   <>
    <Confetti />
    <p className="eyebrow">LOVE AT FIRST SWIPE</p>
    <h2>It's a match!</h2>
    <div className="reveal-art">
     <Heart fill="currentColor"/>
     {!imgError ? (
      <img
       src={`/swatches/${result.heroShade.id}.jpg`}
       alt={`${result.heroShade.name} lipstick swatch`}
       className="reveal-img"
       onError={()=>setImgError(true)}
      />
     ) : (
      <LipArt color={result.heroShade.placeholderHex}/>
     )}
    </div>
    <h3>{result.heroShade.name}</h3>
    <p>{results[result.palette].title}</p>
    <button className="primary" onClick={onNext}>Meet my match</button>
   </>
  )}
 </section>;
}
