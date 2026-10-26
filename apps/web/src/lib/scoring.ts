import { questions, shades, type Palette } from '@/data/quiz';
import { config } from '@/lib/quiz-config';
export type Answers = Partial<Record<'q1'|'q2'|'q3'|'q4',string>>;
export function computeResult(answers:Answers, settings = config) {
 const selected = questions.map(q=>q.options.find(o=>o.id===answers[q.id as keyof Answers]));
 if(selected.some(o=>!o)) throw new Error('Please answer all four questions.');
 const scores:Record<Palette,number> = {nude:0,red:0,pink:0};
 ([0,2,3] as const).forEach(i=>{const option=selected[i]!;scores[option.palette!]+=settings.weights[questions[i].id as 'q1'|'q3'|'q4'];});
 const maximum=Math.max(...Object.values(scores));
 const preference=selected[2]!.palette!;
 const palette:Palette=scores[preference]===maximum?preference: (Object.keys(scores) as Palette[]).find(p=>scores[p]===maximum)!;
 const preferred=[selected[0]!.shadeId,selected[3]!.shadeId].find(id=>shades.some(s=>s.id===id&&s.palette===palette));
 const heroShade=shades.find(s=>s.id===(preferred||settings.defaultHero[palette]))!;
 const tone=selected[1]!.tone!;
 const otherShades=shades.filter(s=>s.palette===palette&&s.id!==heroShade.id);
 if(tone!=='any'&&otherShades.some(s=>s.skinToneFit)) otherShades.sort((a,b)=>(b.skinToneFit?.[tone]??0)-(a.skinToneFit?.[tone]??0));
 return {palette,heroShade,otherShades,scores,heroOutOfStock:!heroShade.inStock,tone};
}
export type QuizResult = ReturnType<typeof computeResult>;
