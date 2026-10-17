// Weekly gate, co-op, reward wheel.
function gateFor(w){
  const c=G(w);if(c){if(!c.start&&c.kr>ri())c.kr=ri();return c}
  const r=rnd("g"+w),p=Math.floor(r()*4),kr=Math.max(0,ri()-Math.floor(r()*2)); // never above the player's rank
  return S.gates[w]={p,kr,start:null,prog:0,done:false,coop:false,paid:false};
}
// Co-op: the player's share is half the target (target() returns the share). Cleared when own reps reach the
// share and combined reps (own + partner's honor-system reps) reach the total. The player earns full XP.
const target=g=>{const t=Math.round(PT[g.p].b*(1+g.kr*1.2)/10)*10;return g.coop?Math.round(t/2/5)*5:t};
function addProg(n){const w=weekId(),g=gateFor(w);if(!g.start||g.done||nowMs()>=gEnd(g,w))return;const p0=g.prog;g.prog=Math.max(0,Math.min(target(g),g.prog+n));histAdd("v",g.prog-p0);checkClear(g);save();render()}
const totalTarget=g=>g.coop?target(g)*2:target(g);
const isCleared=g=>g.prog>=target(g)&&g.prog+(g.pp||0)>=totalTarget(g);
function checkClear(g){if(!g.done&&isCleared(g)){g.done=true;histGate(weekId(),2);toast("Gate cleared. Claim your reward.")}}
function addCustom(sign){const n=Math.floor(+$("cv").value);if(n>0)addProg(sign*Math.min(n,9999))}
function setPartner(v){const w=weekId(),g=gateFor(w);if(!g.start||!g.coop||g.paid||nowMs()>=gEnd(g,w))return;g.pp=Math.max(0,Math.min(9999,Math.floor(+v)||0));checkClear(g);save();render()}
function openGate(){const w=weekId(),g=gateFor(w);if(g.start||gateState(w)!=='open')return;g.bx=gateXp(g);g.start=nowMs();g.end=gateEndMs(w);save();render();gateFx("enter",g)}
function wheelFx(w=weekId()){const g=G(w);if(!g||!g.done||g.paid)return;gateFx("clear",g,()=>wheelOpen(w))}
function claimPartial(w=weekId()){const g=G(w);if(!g||g.paid||g.done||!g.start||nowMs()<gEnd(g,w))return;g.paid=true;histGate(w,g.prog>0?1:0);gain(gatePartialXp(g))}
// Gate window: opens Friday 18:00 local, expires Sunday midnight (= Monday 00:00).
const G=w=>S.co&&S.co.w===w?S.co:S.gates[w];
function gateOpenMs(w){const d=new Date(w+"T18:00:00");d.setDate(d.getDate()+4);return d.getTime()}
function gateEndMs(w){const d=new Date(w+"T00:00:00");d.setDate(d.getDate()+7);return d.getTime()}
const gEnd=(g,w)=>g.end||gateEndMs(w);
const gateEligible=()=>ri()>=2&&weekDone(weekId())>=5;
// locked: not eligible; waiting: eligible, before Friday 18:00; open: can enter / in progress
function gateState(w=weekId()){const g0=G(w);if(S.pause&&!(g0&&g0.start))return"paused";if(!gateEligible())return"locked";if(nowMs()<gateOpenMs(w))return"waiting";return nowMs()<gateEndMs(w)?"open":"over"}
function fmtLeft(ms){const m=Math.max(0,Math.ceil(ms/6e4)),d=Math.floor(m/1440),h=Math.floor(m%1440/60);return d?d+"d "+h+"h":h?h+"h "+m%60+"m":m+"m"}
// Earlier-week gates that were started but never settled (reward or partial XP unclaimed).
function unsettled(){const cw=weekId(),ws=Object.keys(S.gates);if(S.co&&!ws.includes(S.co.w))ws.push(S.co.w);return ws.filter(w=>{const g=G(w);return w<cw&&g&&g.start&&!g.paid}).sort()}
// Gate streak: consecutive weeks with a cleared weekly gate. A week with medical-pause days neither adds nor breaks it,
// and the current week never breaks it (it may still be cleared).
const prevWeek=w=>ds(new Date(new Date(w+"T12:00:00").getTime()-7*864e5));
function weekPaused(w){const d=new Date(w+"T12:00:00");for(let i=0;i<7;i++){const e=S.days[ds(d)];if(e&&e.med)return true;d.setDate(d.getDate()+1)}return false}
function gateStreak(){
  let w=weekId(),n=0;
  for(let i=0;i<520;i++){
    const r=S.hist&&S.hist[w];
    if(r&&r.g==2)n++;
    else if(i>0&&!weekPaused(w))break;
    w=prevWeek(w);
  }
  return n;
}
function code(){const g=gateFor(weekId());return btoa(JSON.stringify({p:g.p,kr:g.kr}))}
function join(){const v=$("jc").value.trim(),k=parseKey(v);if(k){S.jm=addKey(k)?"Key added: rank "+KEYRANK[k.r]+". See Special gates.":"You already hold that key.";save();render();return}try{const c=JSON.parse(atob(v));if(!(c.p>=0&&c.p<=3&&c.kr>=0&&c.kr<=6))throw 0;S.co={w:weekId(),p:c.p,kr:Math.min(c.kr,ri()),start:null,prog:0,done:false,coop:true,paid:false};S.jm="Joined: "+PT[c.p].n+" co-op gate. It appears on the Gates tab when your weekend gate is open.";save();render()}catch(e){S.jm="That code is not valid.";render()}}
function leaveCo(){if(S.co&&S.co.start)return;S.co=null;save();render()} // only before the gate is started
const WS=[1.5,2.2,1.6,1.5,2.0,1.7,1.5,1.8],WC=[1.8,3.0,2.0,2.2,1.8,2.8,2.0,2.5];
// Slice weight w drives both the drawn size and the odds, so they always match. All 1 = equal slices.
const wheelSlices=g=>(g.coop?WC:WS).map((m,i)=>i===KEY_SLOT?{m:"key",w:KEY_W}:{m,w:1});
function wheelAngles(sl){const tot=sl.reduce((a,s)=>a+s.w,0);let a=0;return sl.map(s=>{const sz=s.w/tot*360,r={from:a,mid:a+sz/2,p:s.w/tot};a+=sz;return r})}
function wheelOdds(sl){const o={};sl.forEach(s=>o[s.m]=(o[s.m]||0)+s.w);const tot=sl.reduce((a,s)=>a+s.w,0);return Object.keys(o).sort((a,b)=>(a=="key")-(b=="key")||a-b).map(m=>(m=="key"?"Special key ":m+"x ")+(o[m]/tot*100).toFixed(1).replace(/\.0$/,"")+"%").join(" · ")}
let wheelW;function wheelOpen(w=weekId()){const g=G(w);if(!g||!g.done||g.paid)return;wheelW=w;const sl=wheelSlices(g),an=wheelAngles(sl);const bg=sl.map((_,k)=>(k%2?"#0b1d3a":"#123a66")+" "+an[k].from+"deg "+(k+1<sl.length?an[k+1].from:360)+"deg").join(",");const wl=$("wl");wl.style.transition="none";wl.style.transform="rotate(0deg)";wl.style.background="conic-gradient("+bg+")";wl.innerHTML=sl.map((s,k)=>`<span style="transform:rotate(${an[k].mid}deg) translateY(-92px)">${s.m=="key"?"KEY":s.m+"x"}</span>`).join("");$("wo").textContent="Base "+gateXp(g)+" XP × multiplier (the key slice pays ×1). Odds: "+wheelOdds(sl);$("wr").textContent="";$("wb").textContent="Spin";$("wb").disabled=false;$("wb").onclick=spin;$("wh").classList.add("on")}
function spin(){const g=G(wheelW),sl=wheelSlices(g),an=wheelAngles(sl),wl=$("wl");let t=Math.random()*sl.reduce((a,s)=>a+s.w,0),i=0;while(i<sl.length-1&&t>=sl[i].w){t-=sl[i].w;i++}$("wb").disabled=true;void wl.offsetWidth;wl.style.transition="transform 4s cubic-bezier(.15,.7,.1,1)";wl.style.transform="rotate("+(1800-an[i].mid)+"deg)";setTimeout(()=>{const isKey=sl[i].m==="key",m=isKey?1:sl[i].m,base=gateXp(g),x=wheelXp(g,m),bonus=tokenBonusXp(g),key=isKey?newKey():null;if(key)addKey(key);g.paid=true;if((S.tok||0)<2)S.tok=(S.tok||0)+1;const res=gain(x+bonus,true);toast(bonus?"Tokens full. Bonus XP awarded.":"Rest token earned.");$("wr").textContent=(key?"Special key acquired: rank "+KEYRANK[key.r]+". ":"")+"Base "+base+" XP × "+m+" = "+x+" XP"+(bonus?" · tokens full: +"+bonus+" XP":"");$("wb").textContent="Close";$("wb").disabled=false;$("wb").onclick=()=>{$("wh").classList.remove("on");render();announce(res)}},4300)}
