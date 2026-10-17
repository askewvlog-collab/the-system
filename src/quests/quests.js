// Daily quests, weekly habit, rest tokens, streak.
const PT=[{n:"Legs",e:"squats",x:"squats",b:50,c:"#ffd23d"},{n:"Chest",e:"push-ups",x:"pushups",b:40,c:"#ff4a3d"},{n:"Core",e:"sit-ups",x:"situps",b:50,c:"#3ddc97"},{n:"Back",e:"back extensions",x:"back_ext",b:40,c:"#8a6bff"}];
const TN=["Easy","Medium","Hard"];
// Medium amounts depend on the move (EX[id].med), scaled by rank. Hard = two different exercises (second from another body part).
function exAmt(id,r,f=1){const[lo,hi]=EX[id].med,a=Math.round((lo+Math.floor(r()*(hi-lo+1)))*scale()*f);return a>=30?Math.round(a/5)*5:a}
function quests(date,col=0){
  const r=rnd((col?"q2":"q")+date),ps=[0,1,2,3].sort(()=>r()-.5).slice(0,3),tiers=[0,1,2].sort(()=>r()-.5),pick1=a=>a[Math.floor(r()*a.length)];
  return ps.map((p,i)=>{const t=tiers[i],ex=pick1(exOf(p)),o={p,t,ex,xp:questXp(t)};
    if(t==0)o.amt=1+Math.floor(r()*2);
    else if(t==1)o.amt=exAmt(ex,r);
    else{const p2=pick1([0,1,2,3].filter(x=>x!=p));o.p2=p2;o.amt=exAmt(ex,r,.9);o.ex2=pick1(exOf(p2));o.amt2=exAmt(o.ex2,r,.9)}
    return o}).sort((a,b)=>a.t-b.t);
}
const qLabel=q=>q.amt+" "+EX[q.ex].nm+(q.ex2?" + "+q.amt2+" "+EX[q.ex2].nm:"");
const qParts=q=>PT[q.p].n+(q.ex2?" + "+PT[q.p2].n:"");
// A first star (not S+) adds a second daily-quest column; when it was active that day, both must be cleared (e.c2).
const cols=()=>S.stars.some(s=>!s.plus)?2:1;
function dayDone(d){const e=S.days[d];return !!e&&(e.sg===true||!!(e.done&&(!e.hb||e.h)&&(!e.c2||e.done2)))}
function weekDone(w){let n=0,d=new Date(w+"T12:00:00");for(let i=0;i<7;i++){if(dayDone(ds(d)))n++;d.setDate(d.getDate()+1)}return n}
function pick(i,col=0){const d=today();const e=S.days[d]||(S.days[d]={});if(e[col?"done2":"done"]||e.rest)return;if(col)e.p2=i;else e.p=i;if(cols()>1)e.c2=true;save();render()}
function finish(col=0){const d=today(),e=S.days[d],pk=col?"p2":"p",dk=col?"done2":"done";if(!e||e[pk]==null||e[dk]||e.rest)return;const q=quests(d,col)[e[pk]];e[dk]=true;if(!col)e.hb=!!habit();histClear(q);zap($(col?"fin2":"fin"));const res=gain(q.xp,true);render();setTimeout(()=>{announce(res);const M=MSG[q.t];toast(M[Math.floor(Math.random()*M.length)])},650)}
function questPanel(col,e){
  const pk=col?"p2":"p",dk=col?"done2":"done",qs=quests(today(),col);
  return `<div class="w"><h2>Daily quest${col?" 2":""}</h2><div class="mu">Choose one. Harder quests pay more. Skipping a day costs XP.</div>${qs.map((q,i)=>`<div class="qr"><button class="q ${e[pk]===i?"sel":""}" onclick="pick(${i},${col})" ${e[dk]?"disabled":""}><b>${qLabel(q)}</b><span class="mu">${qParts(q)} · ${TN[q.t]} · </span><span class="xp">+${q.xp} XP</span></button>${exInfoBtn(q.ex+(q.ex2?","+q.ex2:""))}</div>`).join("")}<button id="fin${col||""}" class="go q" style="text-align:center" onclick="finish(${col})" ${e[pk]==null||e[dk]?"disabled":""}>${e[dk]?"Quest cleared":"Mark quest complete"}</button></div>`;
}
const dailyHtml=e=>cols()>1?`<div class="cols">${questPanel(0,e)}${questPanel(1,e)}</div>`:questPanel(0,e);
const MSG=[["Streak held. Easy quest logged.","Easy quest logged. The streak continues.","Minimum met. Streak intact.","Logged. Showing up counts."],["I'm proud of you.","Solid work. That's the kind of effort that builds a rank.","Steady and strong. Keep this up.","Medium effort, real progress. Proud of you."],["Way to go. That was serious work.","That was hard and you did it anyway. Respect.","Beast mode. Your future self thanks you.","Outstanding. Few people push like that."]];
// Habit for week w, built from the quests chosen in the week before it.
function habit(w=weekId()){const pw=new Date(w+"T12:00:00");pw.setDate(pw.getDate()-7);const c=[0,0,0,0],a=[0,0,0,0],n=[0,0,0,0];for(let i=0;i<7;i++){const k=ds(pw),e=S.days[k];if(e&&e.done&&e.p!=null){const q=quests(k)[e.p];if(q){c[q.p]++;if(q.t==1&&q.ex===PT[q.p].x){a[q.p]+=q.amt;n[q.p]++}}}pw.setDate(pw.getDate()+1)}const p=c.indexOf(Math.max(...c));return c[p]>=3?{p,amt:Math.max(5,n[p]?Math.round(a[p]/n[p]):Math.round(EX[PT[p].x].med[0]*scale()))}:null}
function habitDone(){const d=today(),e=S.days[d]||(S.days[d]={});if(e.h)return;e.h=true;histSync();zap($("hb"));const res=gain(habitXp(),true);render();setTimeout(()=>{announce(res);toast("Habit done. Consistency wins.")},650)}
const nextWeekId=()=>ds(new Date(new Date(weekId()+"T12:00:00").getTime()+7*864e5));
function habitHtml(e){
  const h=habit(),P=h&&PT[h.p];
  let out=h?`<div class="w v"><h2>Weekly habit</h2><div class="mu">You picked ${P.n} most last week. Do this every day on top of your quest. Missing either one costs the day. Reward <span class="xp">+${habitXp()} XP</span>.</div><p><b style="font-size:18px">${h.amt} ${P.e}</b> ${exInfoBtn(P.x)}</p><button id="hb" class="${e.h?"":"go"}" onclick="habitDone()" ${e.h?"disabled":""}>${e.h?"Habit done":"Mark habit complete"}</button></div>`:"";
  if(now().getDay()===0){const n=habit(nextWeekId()),N=n&&PT[n.p];out+=`<div class="w"><h2>Next week's habit</h2><div class="mu">${n?`Preview: <b>${n.amt} ${N.e}</b> every day. Based on the quests you chose this week. Clearing another quest today may change it.`:"None yet. A body part chosen on 3 or more days becomes next week's daily habit."}</div></div>`}
  return out}
function restHtml(e){const t=S.tok||0;if(e.rest)return `<div class="w v"><h2>Rest day</h2><div class="mu">Streak protected. No XP lost. This day does not count toward your 5 days.</div></div>`;return `<div class="w"><h2 id="rt">Rest tokens: ${t} / 2</h2><div class="mu">Earned by clearing gates. A rest day keeps your streak and costs no XP, but does not count toward your 5 days.</div>${t>0&&!e.done?`<button style="margin-top:8px" onclick="useRest()">Use rest token</button>`:""}</div>`}
function useRest(){const d=today(),e=S.days[d]||(S.days[d]={});if(e.done||e.rest||e.sg||!(S.tok>0))return;e.rest=true;S.tok--;save();render();toast("Rest day logged.")}
function streak(){let n=0,d=now();if(!dayDone(today())&&!(S.days[today()]&&S.days[today()].rest))d.setDate(d.getDate()-1);while(dayDone(ds(d))||(S.days[ds(d)]&&S.days[ds(d)].rest)){if(dayDone(ds(d)))n++;d.setDate(d.getDate()-1)}return n}
