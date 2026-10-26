import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Heart, X } from 'lucide-react';
import { questions } from '@/data/quiz';
import type { Answers } from '@/lib/scoring';
import { LipArt } from '@/components/lip-art';
export function QuestionScreen({step,answers,onAnswer,onBack}:{step:number;answers:Answers;onAnswer:(id:string)=>void;onBack:()=>void}) {
 const question=questions[step]; const heading=useRef<HTMLHeadingElement>(null); const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [pending,setPending]=useState<string|null>(null); const [deck,setDeck]=useState(()=>Math.max(0,question.options.findIndex(o=>o.id===answers.q3)));const [drag,setDrag]=useState(0);const pointer=useRef<number|null>(null);
 useEffect(()=>{heading.current?.focus();return ()=>{if(timer.current)clearTimeout(timer.current);};},[]);
 const select=(id:string)=>{if(pending)return;setPending(id);timer.current=setTimeout(()=>onAnswer(id),window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:350);};
 const palette=question.options[deck];
 return <section className="question-screen">
 <div className="question-nav"><button className="back" onClick={onBack}><ArrowLeft size={17}/> Back</button><span>{step+1} of 4</span></div>
 <div className="progress-hearts" aria-label={`Question ${step+1} of 4`}>{[0,1,2,3].map(i=><Heart key={i} size={20} fill={i<=step?'currentColor':'none'} className={i<=step?'filled':''}/>)}</div>
 <p className="eyebrow">{['THE PERSONALITY','THE CANVAS','THE PALETTE','THE LOVE STORY'][step]}</p><h2 ref={heading} tabIndex={-1}>{question.title}</h2><p className="helper">{question.helper}</p>
 {step===2?<div className="deck-region" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();select(palette.id);}if(e.key==='ArrowLeft'){e.preventDefault();setDeck((deck+1)%3);}}} tabIndex={0} aria-label="Palette cards. Right arrow to love it, left arrow to pass.">
 <div className="deck-stack">
 <div className="deck-back second"/><div className="deck-back first"/>
 <div className={`palette-card palette-${palette.palette}`} role="radiogroup" aria-label="Favourite palette" style={{transform:`translateX(${drag}px) rotate(${drag/18}deg)`}} onPointerDown={e=>{pointer.current=e.clientX;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(pointer.current!==null)setDrag(e.clientX-pointer.current);}} onPointerUp={()=>{if(drag>80)select(palette.id);else if(drag< -80)setDeck((deck+1)%3);pointer.current=null;setDrag(0);}} onPointerCancel={()=>{pointer.current=null;setDrag(0);}}>
 <span className="eyebrow">{deck+1} / 3 · YOUR COLOUR STORY</span><LipArt/><h3>{palette.label}</h3><p>Swipe right to love it <ArrowRight size={16}/></p>
 </div>
 </div><div className="deck-actions"><button className="secondary" onClick={()=>setDeck((deck+1)%3)}><X size={18}/> Pass</button><button className="primary" role="radio" aria-checked={pending===palette.id||answers.q3===palette.id} disabled={!!pending} onClick={()=>select(palette.id)}><Heart size={18}/> Love it</button></div><p className="micro">Or tap a button — no swiping required.</p>
 </div>:<div className="options" role="radiogroup" aria-label={question.title}>{question.options.map((option,index)=>{
 const selected=(pending||answers[question.id as keyof Answers])===option.id;
 return <button key={option.id} role="radio" aria-checked={selected} disabled={!!pending} className={`option ${selected?'selected':''}`} onClick={()=>select(option.id)} onKeyDown={e=>{if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();const direction=['ArrowDown','ArrowRight'].includes(e.key)?1:-1;const group=e.currentTarget.parentElement;(group?.children[(index+direction+question.options.length)%question.options.length] as HTMLButtonElement)?.focus();}}}>
 <span className={`option-marker tone-${option.tone||'none'}`}>{selected?<Check size={18}/>:step===1?'':String.fromCharCode(65+index)}</span><span><strong>{option.label}</strong>{option.description&&<small>{option.description}</small>}</span><span className="option-radio">{selected&&<span/>}</span></button>;
 })}</div>}
 <p className="question-foot"><Heart size={12}/> There are no wrong answers. Just your kind of love.</p></section>;
}
