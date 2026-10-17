// Medical pause: for illness or injury. While paused every day is a rest day marked med: no XP penalty, the streak
// and gate streak are held, no quests are issued, and a new gate cannot be entered. A started gate or special gate
// can still be played; the special gate's timer is held. Paused days do not count toward the 5 cleared days.
const paused=()=>!!S.pause;
function pauseMark(){
  if(!S.pause)return;
  const t=today();let d=new Date((S.chk||t)+"T12:00:00");
  for(let n=0;n<400&&ds(d)<=t;n++){const k=ds(d),e=S.days[k]||(S.days[k]={});if(!e.done&&!e.sg){e.rest=true;e.med=true}d.setDate(d.getDate()+1)}
  S.chk=t;
}
function pauseStart(){if(S.pause)return;S.pause={t:nowMs()};pauseMark();save();render();toast("Medical pause started. No penalties apply.")}
function pauseEnd(){
  if(!S.pause)return;
  const held=nowMs()-S.pause.t;S.pause=null;
  if(S.sg&&!S.sg.done)S.sg.end+=Math.max(0,held); // the special gate timer was held
  const e=S.days[today()];if(e&&e.med){delete e.rest;delete e.med}
  S.chk=today();save();render();toast("Medical pause ended. Quests resume today.");
}
const pauseHtml=()=>`<div class="w v"><h2>Medical pause</h2><div class="mu">Paused. Rest and recover. No XP is lost, your streak and gate streak are held, and no quests are issued. Resume in Setup when you are ready.</div></div>`;
function pauseSetupHtml(){
  return `<div class="w"><h2>Medical pause</h2><div class="mu">For illness or injury. While paused: no XP penalties, your streak and gate streak are held, no quests are issued, and a new gate cannot be entered. Paused days do not count toward the 5 cleared days.</div>${S.pause?`<div class="mu" style="margin-top:8px">Paused since ${new Date(S.pause.t).toLocaleDateString()}.</div><button class="go" style="margin-top:8px" onclick="pauseEnd()">End pause</button>`:`<button style="margin-top:8px" onclick="pauseStart()">Start pause</button>`}</div>`;
}
