// Single source of truth for XP amounts: shown rewards must equal awarded rewards.
const questXp=t=>t==0?1:Math.round([1,4,10][t]*(1+ri()*.3)); // easy is always 1 XP
const habitXp=()=>Math.round(3*(1+ri()*.3));
// Locked in (g.bx) when the gate is entered, so a rank-up mid-gate cannot change the promised reward.
const gateBase=kr=>{const rel=kr-ri(),m=rel>=2?2:rel==1?1.5:rel==0?1:Math.pow(.6,-rel);return Math.round(30*(1+kr)*m)};
function gateXp(g){return g.bx||gateBase(g.kr)}
const gatePartialXp=g=>Math.round(gateXp(g)*.7*g.prog/target(g));
const wheelXp=(g,m)=>Math.round(gateXp(g)*m);
// Extra XP in place of a rest token once the inventory is full (2).
const tokenBonusXp=g=>(S.tok||0)>=2?Math.round(gateXp(g)*.25):0;
