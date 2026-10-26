import { lazy, Suspense, useCallback, useEffect, useReducer, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { quizReducer, initialState } from '@/lib/quiz-reducer';
import { computeResult } from '@/lib/scoring';
import { Splash } from '@/components/home/splash';
import { QuestionScreen } from '@/components/home/question-screen';
import { MatchTransition } from '@/components/home/match-transition';
const ResultScreen=lazy(()=>import('@/components/home/result-screen').then(m=>({default:m.ResultScreen})));
export function QuizApp() {
 const [state,dispatch]=useReducer(quizReducer,initialState);const [offline,setOffline]=useState(false);
 const next=useCallback(()=>dispatch({type:state.screen==='loading'?'reveal':'result'}),[state.screen]);
 useEffect(()=>{
 const update=()=>setOffline(!navigator.onLine);update();window.addEventListener('online',update);window.addEventListener('offline',update);
 if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').then(async registration=>{
 await navigator.serviceWorker.ready;
 await import('@/components/home/result-screen');
 const urls=performance.getEntriesByType('resource').map(entry=>entry.name).filter(url=>url.startsWith(window.location.origin));
 (registration.active||navigator.serviceWorker.controller)?.postMessage({type:'CACHE_URLS',urls:['/',...urls]});
 }).catch(()=>{/* Quiz remains usable without service workers. */});
 return ()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update);};
 },[]);
 const result=['loading','reveal','result'].includes(state.screen)?computeResult(state.answers):null;
 return <div className="app-frame">
 {offline&&<div className="offline-banner"><WifiOff size={16}/> You're offline. Your love story can still continue.</div>}
 <main aria-live="polite">
 {state.screen==='splash'&&<Splash onStart={()=>dispatch({type:'start'})}/>}
 {state.screen==='question'&&<QuestionScreen key={state.step} step={state.step} answers={state.answers} onAnswer={id=>dispatch({type:'answer',id})} onBack={()=>dispatch({type:'back'})}/>}
 {result&&(state.screen==='loading'||state.screen==='reveal')&&<MatchTransition key={state.screen} screen={state.screen} result={result} onNext={next}/>}
 {state.screen==='result'&&result&&<Suspense fallback={<p role="status">Opening your match...</p>}><ResultScreen result={result} offline={offline} onRetake={()=>dispatch({type:'reset'})}/></Suspense>}
 </main>
 </div>;
}
