import { Heart } from 'lucide-react';
import { results } from '@/data/quiz';
import { config, shopUrl } from '@/lib/quiz-config';
import type { QuizResult } from '@/lib/scoring';
import { Swatch } from '@/components/swatch';
export function ResultScreen({result,offline,onRetake}:{result:QuizResult;offline:boolean;onRetake:()=>void}) {
 const copy=results[result.palette];const next=result.otherShades.find(s=>s.inStock);
 return <section className={`result-screen palette-${result.palette}`}><div className="match-label"><Heart size={15} fill="currentColor"/> It's a match!</div><p className="eyebrow">Your Love Struck match</p><h2>{copy.title}</h2><p className="result-body">{copy.body}</p>{copy.closer&&<p className="result-body">{copy.closer}</p>}<div className="hero-shade"><p className="eyebrow">YOUR LIP SOULMATE</p><Swatch key={result.heroShade.id} shade={result.heroShade} tone={result.tone}/><h3>{result.heroShade.name}</h3><p>{result.heroShade.tagline}</p>{result.heroOutOfStock&&<p className="stock-note">This one is out of stock right now. Next best match: <strong>{next?.name}</strong>.<br/><a href={shopUrl(result.heroShade)} target="_blank" rel="noopener noreferrer">Visit Nykaa for stock alerts</a><small>Stock status recorded on 23 Oct 2026. Check Nykaa for current availability.</small></p>}<button type="button" className="primary" onClick={onRetake}>Retake the test</button>{offline&&<p className="stock-note">Shopping needs an internet connection.</p>}</div><div className="love-note"><Heart size={20}/><p className="eyebrow">Your love note</p><p>{copy.note}</p></div>{config.footerNote&&<p>{config.footerNote}</p>}</section>;
}
