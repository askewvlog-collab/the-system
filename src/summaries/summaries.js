// Read-only weekly and monthly summaries. One compact record per week in S.hist, never one per action.
// Record: c cleared days, xp gained, xl XP lost to penalties, v volume (reps), st best streak,
// g gate result (0 none, 1 partial, 2 cleared), bp completed quests per body part [legs, chest, core, back]
// (kept for a future radar chart). Summaries are information only and never become tasks.
const hrec=(w=weekId())=>{const h=S.hist||(S.hist={});return h[w]||(h[w]={c:0,xp:0,xl:0,v:0,st:0,g:0,bp:[0,0,0,0]})};
const histAdd=(f,n,w)=>{const r=hrec(w);r[f]=Math.max(0,r[f]+n)};
function histSync(){const r=hrec();r.c=weekDone(weekId());r.st=Math.max(r.st,streak())}
function histClear(q){const r=hrec();r.bp[q.p]++;if(q.ex2)r.bp[q.p2]++;r.v+=q.amt+(q.amt2||0);histSync()}
const histGate=(w,res)=>{const r=hrec(w);r.g=Math.max(r.g,res)};

let sumView="w";
const sumSet=v=>{sumView=v;render()};
const wkLabel=w=>new Date(w+"T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"});
function sumLine(r,extra){
  const bp=PT.map((p,i)=>p.n+" "+r.bp[i]).join(" · ");
  return `<div class="mu">Cleared days: <b>${r.c}</b> · Best streak: <b>${r.st}</b> · XP: <b class="xp">+${r.xp}</b>${r.xl?" (−"+r.xl+" penalties)":""}<br>${extra}<br>Volume: <b>${r.v}</b> reps<br>Quests by body part: ${bp}</div>`;
}
function summaryHtml(){
  const h=S.hist||{},ws=Object.keys(h).sort().reverse();
  let body="";
  if(sumView=="w"){
    body=ws.slice(0,8).map(w=>`<div class="w"><h2>Week of ${wkLabel(w)}${w==weekId()?" (this week)":""}</h2>${sumLine(h[w],"Gate: "+["none","partial","cleared"][h[w].g])}</div>`).join("");
  }else{
    const m={};ws.forEach(w=>{const k=w.slice(0,7),r=m[k]||(m[k]={c:0,xp:0,xl:0,v:0,st:0,g:0,gc:0,bp:[0,0,0,0]}),x=h[w];
      r.c+=x.c;r.xp+=x.xp;r.xl+=x.xl;r.v+=x.v;r.st=Math.max(r.st,x.st);if(x.g==2)r.gc++;x.bp.forEach((n,i)=>r.bp[i]+=n)});
    body=Object.keys(m).sort().reverse().slice(0,6).map(k=>`<div class="w"><h2>${new Date(k+"-15T12:00:00").toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2>${sumLine(m[k],"Gates cleared: "+m[k].gc)}</div>`).join("");
  }
  return `<div class="w"><h2>Summary</h2><div class="mu">A record of your progress. Nothing here is required.</div><div class="row" style="justify-content:flex-start;margin-top:8px"><button class="${sumView=="w"?"go":""}" onclick="sumSet('w')">Weekly</button><button class="${sumView=="m"?"go":""}" onclick="sumSet('m')">Monthly</button></div></div>`+(body||`<div class="w"><div class="mu">No records yet. They appear after your first quest.</div></div>`)+(sumView=="m"?`<div class="mu" style="margin:0 4px">A week counts toward the month it starts in.</div>`:"");
}
