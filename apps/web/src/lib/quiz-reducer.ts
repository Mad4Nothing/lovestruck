import type { Answers } from '@/lib/scoring';
export type QuizState={screen:'splash'|'question'|'loading'|'reveal'|'result';step:number;answers:Answers};
export const initialState:QuizState={screen:'splash',step:0,answers:{}};
export type QuizAction={type:'start'|'back'|'reveal'|'result'|'reset'}|{type:'answer';id:string};
export function quizReducer(state:QuizState,action:QuizAction):QuizState {
 switch(action.type){
 case 'start':return {...initialState,screen:'question'};
 case 'reset':return initialState;
 case 'back':return {...state,screen:state.step===0?'splash':'question',step:Math.max(0,state.step-1)};
 case 'answer':return {...state,answers:{...state.answers,[`q${state.step+1}`]:action.id},step:state.step===3?3:state.step+1,screen:state.step===3?'loading':'question'};
 case 'reveal':return {...state,screen:'reveal'};
 case 'result':return {...state,screen:'result'};
 }
}
