// Dev-only test panel. Built into dev.html by `python3 build.py`; never part of index.html or the release.
// Uses its own save key (gate1dev), so a real save is never touched. Time travel persists in gate1dev.off.
(function(){
  const OFF="gate1dev.off";
  try{S.off=+localStorage.getItem(OFF)||0}catch(e){}
  const saveOff=()=>{try{localStorage.setItem(OFF,S.off||0)}catch(e){}};
  const goto=(str)=>{S.off=(new Date(str).getTime()-Date.now())/864e5;saveOff();penalty();save();render()};
  const mon=()=>weekId();
  const at=(dayIdx,hm)=>{const d=new Date(mon()+"T00:00:00");d.setDate(d.getDate()+dayIdx);const p=hm.split(":");d.setHours(+p[0],+p[1],0,0);return d};
  const A={
    "+1 day":()=>{S.off=(S.off||0)+1;saveOff();penalty();save();render()},
    "Jump: Friday 17:59":()=>goto(at(4,"17:59")),
    "Jump: Friday 18:00":()=>goto(at(4,"18:00")),
    "Jump: Sunday 23:59":()=>goto(at(6,"23:59")),
    "Jump: next Monday 00:00":()=>goto(at(7,"00:00")),
    "Back to real time":()=>{S.off=0;saveOff();render()},
    "Clear 5 days this week":()=>{const d=new Date(mon()+"T12:00:00");for(let i=0;i<5;i++){S.days[ds(d)]={p:0,done:true};d.setDate(d.getDate()+1)}histSync();save();render()},
    "+50 XP":()=>{gain(50);render()},
    "Rank D (120 XP)":()=>{S.xp=120;raiseFloor();save();render()},
    "Rank A (1500 XP)":()=>{S.xp=1500;raiseFloor();save();render()},
    "Rank S (via XP gain, plays secret sequence)":()=>{S.xp=Math.min(S.xp,2990);raiseFloor();const r=gain(3010-S.xp);render()},
    "Forget secret discovery":()=>{S.sec=false;S.plus=false;S.att=0;save();render()},
    "Rest tokens = 2":()=>{S.tok=2;save();render()},
    "Add key (rank+1)":()=>{addKey(newKey());save();render()},
    "Add keys: every rank":()=>{for(let r=0;r<7;r++)addKey({r,s:100+r});save();render()},
    "Finish this week's gate":()=>{const g=gateFor(weekId());if(!g.start){g.bx=gateXp(g);g.start=nowMs();g.end=gateEndMs(weekId())}g.prog=target(g);g.pp=g.coop?target(g):0;checkClear(g);save();render()},
    "Play: speed rush (enter)":()=>gateFx("enter",{p:0,kr:3}),
    "Play: hellscape (enter)":()=>gateFx("enter",{p:1,kr:5}),
    "Play: thunderstorm (enter)":()=>gateFx("enter",{p:3,kr:6}),
    "Play: speed rush (clear)":()=>gateFx("clear",{p:0,kr:3}),
    "Play: hellscape (clear)":()=>gateFx("clear",{p:1,kr:5}),
    "Play: thunderstorm (clear)":()=>gateFx("clear",{p:3,kr:6}),
    "Open wheel (test)":()=>{const w=weekId(),g=gateFor(w);if(!g.start){g.bx=gateXp(g);g.start=nowMs();g.end=gateEndMs(w)}g.done=true;g.paid=false;save();wheelOpen(w)},
    "Force key slice on next spin":()=>{const r=Math.random;Math.random=()=>(KEY_SLOT+.2*KEY_W)/(7+KEY_W);setTimeout(()=>Math.random=r,200);toast("Spin now: forced key slice.")},
    "Replay tutorial":()=>tutStart(),
    "Reset dev save":()=>{S=def();S.off=0;saveOff();save();render()}
  };
  const box=document.createElement("div");
  box.style.cssText="position:fixed;right:8px;top:8px;z-index:30;font:12px system-ui;max-width:230px";
  const t=document.createElement("button");t.textContent="DEV";t.style.cssText="padding:4px 8px;background:#7c1d1d;border-color:#ff4a3d";
  const p=document.createElement("div");p.style.cssText="display:none;margin-top:4px;padding:6px;background:#000d;border:1px solid #ff4a3d;max-height:80vh;overflow:auto";
  Object.keys(A).forEach(k=>{const b=document.createElement("button");b.textContent=k;b.style.cssText="display:block;width:100%;margin:2px 0;padding:5px 6px;font-size:12px;text-align:left";b.onclick=()=>{A[k]();if(/^Play|wheel|Force/.test(k))p.style.display="none"};p.appendChild(b)});
  const info=document.createElement("div");info.className="mu";info.style.cssText="margin-top:6px";p.appendChild(info);
  const upd=()=>{info.textContent="Game time: "+now().toLocaleString()};setInterval(upd,1000);upd();
  t.onclick=()=>p.style.display=p.style.display=="none"?"block":"none";
  box.appendChild(t);box.appendChild(p);document.body.appendChild(box);
  render();
})();
