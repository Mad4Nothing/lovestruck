import { Heart } from 'lucide-react';
import { results } from '@/data/quiz';
import { config } from '@/lib/quiz-config';
import type { QuizResult } from '@/lib/scoring';
import { MatchedShadesCarousel } from '@/components/home/matched-shades-carousel';

export function ResultScreen({result,offline,onRetake}:{result:QuizResult;offline:boolean;onRetake:()=>void}) {
 const copy=results[result.palette];
 const allMatchedShades = [result.heroShade, ...result.otherShades];
 return (
  <section className={`result-screen palette-${result.palette}`}>
   <div className="match-label"><Heart size={15} fill="currentColor"/> It's a match!</div>
   <p className="eyebrow">Your Love Struck match</p>
   <h2>{copy.title}</h2>
   <p className="result-body">{copy.body}</p>
   {copy.closer&&<p className="result-body">{copy.closer}</p>}
   <MatchedShadesCarousel shades={allMatchedShades} offline={offline} />
   <div className="love-note">
    <p className="eyebrow">Your love note</p>
    <p>{copy.note}</p>
   </div>
   <button id="retake-quiz-btn" type="button" className="primary retake" onClick={onRetake} aria-label="Retake the quiz">Retake the test</button>
   {config.footerNote&&<p>{config.footerNote}</p>}
  </section>
 );
}

