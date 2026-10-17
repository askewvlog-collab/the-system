// Special gate: a hard compound challenge opened with a key. While active (up to 5 days) it replaces the daily
// quests, and each day with progress counts as a cleared day. The weekly gate is unaffected.
// Reward: big XP and a rest token. If it expires uncleared the key is returned (no penalty).
// Result format for future friend comparison: R1:<code>:<cleared 1|0>:<days used>:<reps,reps,reps>
const SG_DAYS=5;
const sgActive=()=>!!S.sg&&!S.sg.done;
const sgXp=g=>Math.round(g.bx*(g.run?1.2:1));
function sgBuild(k){
  const rr=rnd("sg"+keyCode(k)),parts=[0,1,2,3].sort(()=>rr()-.5).slice(0,3),gap=Math.max(0,k.r-ri());
  const ex=parts.map(p=>{const a=exOf(p);return a[Math.floor(rr()*a.length)]});
  const t=ex.map(id=>{const[lo,hi]=EX[id].med,a=Math.round((lo+hi)/2*(1+k.r*.15)*(1+.2*gap));return a>=30?Math.round(a/5)*5:a});
  return{ex,t,gap}; // lower-rank players facing a higher key get larger targets by rank gap
}
function openSpecial(id,b){
  const i=S.keys.findIndex(k=>k.id===id);if(i<0||S.sg)return;
  if(!b.dataset.c){b.dataset.c="1";b.textContent="Tap again: replaces daily quests for up to 5 days";setTimeout(()=>{b.dataset.c="";b.textContent="Enter"},4000);return}
  const k=S.keys[i],B=sgBuild(k);S.keys.splice(i,1);
  S.sg={id:k.id,r:k.r,s:k.s,start:nowMs(),end:nowMs()+SG_DAYS*864e5,ex:B.ex,t:B.t,p:[0,0,0],run:false,done:false,bx:2*gateBase(k.r)};
  save();render();gateFx("enter",S.sg);
}
function sgExpire(){const g=S.sg;if(g&&!g.done&&!S.pause&&nowMs()>=g.end){addKey({r:g.r,s:g.s});S.sg=null;save();toast("Special gate expired. Key returned.")}}
function sgAdd(i,n){
  const g=S.sg;if(!g||g.done||nowMs()>=g.end)return;
  const p0=g.p[i];g.p[i]=Math.max(0,Math.min(g.t[i],p0+n));const d=g.p[i]-p0;histAdd("v",d);
  if(d>0){const e=S.days[today()]||(S.days[today()]={});e.sg=true;histSync()}
  if(g.p.every((v,j)=>v>=g.t[j])){g.done=true;toast("Special gate cleared. Claim your reward.")}
  save();render();
}
// Abandon an unfinished special gate: the key is returned and there is no penalty.
function sgBail(b){
  const g=S.sg;if(!g||g.done)return;
  if(!b.dataset.c){b.dataset.c="1";b.textContent="Tap again: abandon and get the key back";setTimeout(()=>{b.dataset.c="";b.textContent="Abandon gate"},4000);return}
  addKey({r:g.r,s:g.s});S.sg=null;save();render();toast("Special gate abandoned. Key returned.");
}
const sgRun=()=>{const g=S.sg;if(g&&!g.done){g.run=!g.run;save();render()}};
const sgClaimFx=()=>{if(S.sg&&S.sg.done)gateFx("clear",S.sg,sgClaim)};
function sgClaim(){
  const g=S.sg;if(!g||!g.done)return;
  const bonus=tokenBonusXp({kr:g.r,bx:g.bx});if((S.tok||0)<2)S.tok=(S.tok||0)+1;
  S.sg=null;const res=gain(sgXp(g)+bonus,true);save();render();announce(res);
  toast(bonus?"Tokens full. Bonus XP awarded.":"Rest token earned.");
}
const sgResult=g=>"R1:"+g.id+":"+(g.done?1:0)+":"+Math.min(SG_DAYS,Math.ceil((nowMs()-g.start)/864e5)||1)+":"+g.p.join(",");
function sgHtml(){
  const g=S.sg;if(!g)return"";
  const left=fmtLeft(g.end-nowMs());
  const rows=g.ex.map((id,i)=>`<div style="margin-top:10px"><b>${g.p[i]} / ${g.t[i]} ${EX[id].nm}</b> ${exInfoBtn(id)}<div class="bar"><i style="width:${g.p[i]/g.t[i]*100}%"></i></div>${g.done?"":`<div class="row" style="justify-content:flex-start">${[1,5,10].map(k=>`<button onclick="sgAdd(${i},${k})">+${k}</button>`).join("")}${[1,5].map(k=>`<button onclick="sgAdd(${i},-${k})">−${k}</button>`).join("")}</div>`}</div>`).join("");
  return `<div class="w v flame" style="--c:${KC[g.r]}"><h2>Special gate · rank ${KEYRANK[g.r]}</h2><div class="mu">${g.done?"Cleared.":left+" left. Replaces your daily quests. Each day with progress counts as a cleared day."} Reward <span class="xp">+${sgXp(g)} XP</span> and a rest token${g.run?"":" (+20% XP with the optional run)"}. Split into sets. Stop if anything hurts.</div>${rows}${g.done?`<button class="go" style="margin-top:12px" onclick="sgClaimFx()">Claim reward</button><div class="mu" style="margin-top:8px">Result code: ${sgResult(g)}</div>`:`<button style="margin-top:12px" class="${g.run?"go":""}" onclick="sgRun()">${g.run?"Run logged (10 min)":"Optional: log a 10-minute run"}</button> <button style="margin-top:12px" onclick="sgBail(this)">Abandon gate</button>`}</div>`;
}
