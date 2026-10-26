import { build } from 'esbuild';
import assert from 'node:assert/strict';
const bundle=await build({entryPoints:['apps/web/src/lib/scoring.ts'],bundle:true,write:false,format:'esm',platform:'node',alias:{'@':'./apps/web/src'}});
const {computeResult}=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const base={weights:{q3:3,q1:2,q4:2},defaultHero:{nude:'latte-love',red:'red-my-mind',pink:'berry-sweet'}};
const cases=[
 ['q1a','q3b','q4a','nude','soft-girl-era',{nude:4,red:3,pink:0}],
 ['q1c','q3c','q4d','pink','pretty-problem',{nude:2,red:0,pink:5}],
 ['q1b','q3a','q4b','nude','caramel-drip',{nude:5,red:2,pink:0}],
 ['q1b','q3b','q4c','red','red-my-mind',{nude:0,red:7,pink:0}],
 ['q1d','q3a','q4a','nude','bare-minimum',{nude:5,red:0,pink:2}],
];
for(const [q1,q3,q4,palette,hero,scores] of cases){for(const q2 of ['q2a','q2b','q2c','q2d']){const result=computeResult({q1,q2,q3,q4},base);assert.equal(result.palette,palette);assert.equal(result.heroShade.id,hero);assert.deepEqual(result.scores,scores);}}
const tie=computeResult({q1:'q1a',q2:'q2a',q3:'q3b',q4:'q4a'},{...base,weights:{...base.weights,q3:4}});assert.equal(tie.palette,'red');assert.equal(tie.heroShade.id,'red-my-mind');
const stock=computeResult({q1:'q1d',q2:'q2a',q3:'q3a',q4:'q4a'},base);assert.equal(stock.heroOutOfStock,true);assert.equal(stock.otherShades.find((shade:{inStock:boolean})=>shade.inStock).id,'caramel-drip');
assert.throws(()=>computeResult({q1:'q1a'}));
console.log('PASS: required scoring cases, all Q2 tones, tie-breaking, stock fallback and invalid-answer validation.');
