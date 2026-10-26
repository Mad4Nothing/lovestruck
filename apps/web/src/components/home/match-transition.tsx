import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { LipArt } from '@/components/lip-art';
import { Confetti } from '@/components/confetti';
import { results } from '@/data/quiz';
import type { QuizResult } from '@/lib/scoring';

export function MatchTransition({screen,result,onNext}:{screen:'loading'|'reveal';result:QuizResult;onNext:()=>void}) {
 useEffect(()=>{
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timer=setTimeout(onNext,reduced?0:screen==='loading'?1500:5000);
  return ()=>clearTimeout(timer);
 },[screen,onNext]);

 return <section className={`transition-screen ${screen} relative overflow-hidden`} aria-live="polite">
  {screen==='loading'?(
   <>
    <div className="loader-lip"><div className="bullet"/><div className="tube"/></div>
    <h2>Checking your chemistry...</h2>
    <p>Finding your lip soulmate</p>
   </>
  ):(
   <>
    <Confetti />
    <p className="eyebrow">LOVE AT FIRST SWIPE</p>
    <h2>It's a match!</h2>
    <div className="reveal-art"><Heart fill="currentColor"/><LipArt color={result.heroShade.placeholderHex}/></div>
    <h3>{result.heroShade.name}</h3>
    <p>{results[result.palette].title}</p>
    <button className="primary" onClick={onNext}>Meet my match</button>
   </>
  )}
 </section>;
}
