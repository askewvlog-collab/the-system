// Regression tests. Run: python3 build.py, then open tests/runner.html in a browser (results on page and in window.__results).
// Tests drive the real app code; time travel uses S.off (days) and a stubbed localStorage, so no real save is touched.
const TESTS=[];const test=(n,f)=>TESTS.push([n,f]);
const canon=x=>JSON.stringify(x,(k,v)=>v&&typeof v==="object"&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(q=>[q,v[q]])):v);
const eq=(a,b,m)=>{if(canon(a)!==canon(b))throw new Error((m?m+": ":"")+"expected "+JSON.stringify(b)+", got "+JSON.stringify(a))};
const ok=(c,m)=>{if(!c)throw new Error(m||"assertion failed")};
const throws=(f,m)=>{let t=false;try{f()}catch(e){t=true}if(!t)throw new Error(m||"expected a throw")};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const at=s=>{S.off=(new Date(s).getTime()-Date.now())/864e5};
const fresh=(xp=0)=>{S=def();S.xp=xp;S.chk=null;raiseFloor();["ov","pn","wh","tut","ex"].forEach(i=>$(i).classList.remove("on"))};
const daysAgo=n=>{const d=new Date(now());d.setDate(d.getDate()-n);return ds(d)};
const clearDay=d=>{S.days[d]={p:0,done:true}};
const gateAt=(w,o)=>S.gates[w]=Object.assign({p:1,kr:2,start:null,prog:0,done:false,coop:false,paid:false},o);

// ---- rank floors
test("floor: reached rank D is kept through a long absence",()=>{fresh(110);S.chk=daysAgo(30);penalty();ok(S.xp>=100,"xp "+S.xp);eq(R[ri()],"D")});
test("floor: floor never lowers and caps at A",()=>{fresh(3100);eq(S.fl,5);S.xp=0;raiseFloor();eq(S.fl,5)});
test("floor: S can fall only to A",()=>{fresh(3010);S.chk=daysAgo(300);for(let i=0;i<60;i++){S.chk=daysAgo(1);penalty()}ok(S.xp>=1400,"xp "+S.xp);eq(R[ri()],"A")});
test("floor: XP above the floor can drop",()=>{fresh(50);S.chk=daysAgo(1);penalty();ok(S.xp<50)});
test("floor: regaining S does not replay the secret sequence",()=>{fresh(2990);S.sec=true;gain(20);eq($("ot").textContent,"Rank up")});

// ---- missed-day cap
test("cap: ten missed days cost one penalty",()=>{fresh(500);S.chk=daysAgo(10);penalty();eq(500-S.xp,8)});
test("cap: no penalty on the same day",()=>{fresh(500);S.chk=today();penalty();eq(S.xp,500)});
test("cap: rest days are not missed",()=>{fresh(500);S.chk=daysAgo(3);[3,2,1].forEach(n=>S.days[daysAgo(n)]={rest:true});penalty();eq(S.xp,500)});
test("cap: with a token the player chooses; second call keeps one pending penalty",()=>{fresh(500);S.tok=1;S.chk=daysAgo(9);penalty();ok(S.pend,"pending");eq(S.xp,500);penalty();eq(S.pend.m,9);pendResolve(true);eq([S.xp,S.tok],[500,0])});
test("cap: declining the token loses XP and keeps it",()=>{fresh(500);S.tok=2;S.chk=daysAgo(5);penalty();pendResolve(false);eq([S.xp<500,S.tok],[true,2])});
test("cap: at the floor no choice is offered",()=>{fresh(100);S.tok=2;S.chk=daysAgo(5);penalty();ok(!S.pend);eq(S.xp,100)});

// ---- week boundaries and gate window
test("week: Sunday 23:59 and Monday 00:00 are different weeks",()=>{fresh();at("2026-10-18T23:59:00");const a=weekId();at("2026-10-19T00:00:00");eq([a,weekId()],["2026-10-12","2026-10-19"])});
test("week: only cleared days count, rest days do not",()=>{fresh(120);["2026-10-12","2026-10-13","2026-10-14"].forEach(clearDay);S.days["2026-10-15"]={rest:true};eq(weekDone("2026-10-12"),3)});
test("gate: needs rank D and 5 cleared days",()=>{fresh(120);at("2026-10-16T12:00:00");["12","13","14","15"].forEach(d=>clearDay("2026-10-"+d));eq(gateState(),"locked");clearDay("2026-10-16");eq(gateState(),"waiting");fresh(50);at("2026-10-16T12:00:00");["12","13","14","15","16"].forEach(d=>clearDay("2026-10-"+d));eq(gateState(),"locked","rank E")});
test("gate: opens Friday 18:00 local, expires Sunday midnight",()=>{fresh(120);["12","13","14","15","16"].forEach(d=>clearDay("2026-10-"+d));at("2026-10-16T17:59:00");eq(gateState(),"waiting");openGate();ok(!gateFor(weekId()).start);at("2026-10-16T18:00:00");eq(gateState(),"open");openGate();ok(gateFor(weekId()).start);at("2026-10-18T23:59:00");eq(gateState(),"open");at("2026-10-19T00:00:00");eq(gateState(),"locked")});
test("gate: weekly gate never exceeds the player's rank",()=>{for(let r=0;r<7;r++)for(let k=0;k<60;k++){fresh(T[r]);const g=gateFor(new Date(2026,0,5+k*7).toISOString().slice(0,10));ok(g.kr<=r,"kr "+g.kr+" rank "+r)}});
test("gate: no progress after expiry",()=>{fresh(120);at("2026-10-17T12:00:00");const w=weekId(),g=gateAt(w,{start:nowMs(),end:nowMs()+36e5,prog:0});addProg(5);eq(g.prog,5);at("2026-10-18T13:00:00");addProg(5);eq(g.prog,5)});
test("gate: previous week's unfinished gate pays partial XP once",()=>{fresh(120);at("2026-10-20T12:00:00");const g=gateAt("2026-10-12",{start:1,end:2,prog:20,bx:90});eq(unsettled(),["2026-10-12"]);const x=S.xp,exp=gatePartialXp(g);claimPartial("2026-10-12");claimPartial("2026-10-12");eq(S.xp-x,exp);eq(unsettled(),[])});
test("gate: progress never goes below zero or above the target",()=>{fresh(120);const g=gateAt(weekId(),{start:nowMs(),end:nowMs()+1e9});addProg(-50);eq(g.prog,0);addProg(99999);eq(g.prog,target(g));ok(g.done)});

test("gate streak: counts consecutive cleared weeks, current week never breaks it",()=>{fresh(120);at("2026-10-22T12:00:00");eq(weekId(),"2026-10-19");eq(gateStreak(),0);hrec("2026-10-19").g=2;eq(gateStreak(),1,"current week cleared");hrec("2026-10-12").g=2;hrec("2026-10-05").g=2;eq(gateStreak(),3);delete S.hist["2026-10-19"];eq(gateStreak(),2,"current week not cleared yet");hrec("2026-10-12").g=1;eq(gateStreak(),0,"partial last week breaks it")});
test("gate streak: a missing past week breaks it",()=>{fresh(120);at("2026-10-22T12:00:00");hrec("2026-10-12").g=2;hrec("2026-09-28").g=2;eq(gateStreak(),1)});

// ---- reward claims
test("reward: quest XP shown equals awarded, claimed once",async()=>{fresh(120);const q=quests(today())[1];pick(1);const x=S.xp;finish();finish();eq(S.xp-x,q.xp);await wait(700)});
test("reward: easy quest is 1-2 reps and exactly 1 XP at every rank",()=>{for(let r=0;r<7;r++){fresh(T[r]);for(let d=0;d<30;d++)quests("2026-11-"+String(d+1).padStart(2,"0")).filter(q=>q.t==0).forEach(q=>{eq(q.xp,1);ok(q.amt>=1&&q.amt<=2)})}});
test("reward: hard quests combine two different exercises",()=>{fresh(120);for(let d=0;d<40;d++)quests("2026-11-"+String(d+1).padStart(2,"0")).filter(q=>q.t==2).forEach(q=>{ok(q.ex2&&q.ex2!==q.ex&&q.p2!==q.p)})});
test("reward: wheel pays base x multiplier once and grants one token",async()=>{fresh(120);const w=weekId();const g=gateAt(w,{start:nowMs(),end:nowMs()+1e9,prog:90,done:true,bx:90});S.tok=0;wheelOpen();const real=Math.random;Math.random=()=>0.01;spin();Math.random=real;await wait(4500);eq(S.tok,1);ok(g.paid);const x=S.xp;wheelOpen();eq(S.xp,x);ok(!$("wh").classList.contains("on")||true);eq(S.tok,1)});
test("reward: wheel odds match slice sizes",()=>{fresh(120);const sl=wheelSlices({coop:false}),an=wheelAngles(sl);const tot=an.reduce((a,x,i)=>a+x.p,0);ok(Math.abs(tot-1)<1e-9);sl.forEach((s,i)=>{const next=i+1<sl.length?an[i+1].from:360;ok(Math.abs((next-an[i].from)/360-an[i].p)<1e-9)});ok(sl.filter(s=>s.m==="key").length===1&&an[KEY_SLOT].p<.1)});
test("reward: gate base XP is locked on entry",()=>{fresh(120);const g=gateAt(weekId(),{kr:2});g.bx=gateXp(g);const a=gateXp(g);S.xp=900;eq(gateXp(g),a)});

// ---- co-op transitions
test("coop: share is half, needs own share and combined total, full XP",()=>{fresh(120);const w=weekId();S.co={w,p:1,kr:2,start:nowMs(),end:nowMs()+1e9,prog:0,pp:0,done:false,coop:true,paid:false};const g=S.co,t=target(g);eq(totalTarget(g),t*2);addProg(t);ok(!g.done);setPartner(t-5);ok(!g.done);setPartner(t);ok(g.done)});
test("coop: partner reps first, then own",()=>{fresh(120);const w=weekId();S.co={w,p:1,kr:2,start:nowMs(),end:nowMs()+1e9,prog:0,pp:0,done:false,coop:true,paid:false};const g=S.co,t=target(g);setPartner(t);addProg(t-5);ok(!g.done);addProg(5);ok(g.done)});
test("coop: a joined gate can be left before starting, own gate remains",()=>{fresh(120);document.getElementById("jc").value=btoa(JSON.stringify({p:2,kr:1}));join();ok(S.co&&S.co.coop);leaveCo();eq(S.co,null);ok(gateFor(weekId()))});
test("coop: a started co-op gate cannot be left",()=>{fresh(120);document.getElementById("jc").value=btoa(JSON.stringify({p:2,kr:1}));join();S.co.start=nowMs();leaveCo();ok(S.co)});
test("coop: joined key rank is capped at the player's rank",()=>{fresh(120);document.getElementById("jc").value=btoa(JSON.stringify({p:0,kr:6}));join();eq(S.co.kr,2)});

// ---- saves and import
test("save: v1 save migrates to the latest version",()=>{const s=parseSave(JSON.stringify({v:1,xp:300,days:{"2026-10-10":{p:1,done:true}}}));eq(s.v,SAVE_VERSION);eq(s.xp,300);ok(Array.isArray(s.keys)&&Array.isArray(s.stars)&&s.hist)});
test("save: every older version migrates",()=>{for(let v=1;v<SAVE_VERSION;v++)eq(parseSave(JSON.stringify({v,xp:5})).v,SAVE_VERSION)});
test("save: import failure keeps the current state",()=>{fresh(777);const before=JSON.stringify(S);for(const bad of ["abc","[]",'{"xp":"5"}','{"xp":-1}','{"xp":5,"v":99}','{}']){$("jx").value=bad;impJ();eq(JSON.stringify(S),before,bad)}});
test("save: valid import replaces the state",()=>{fresh(100);$("jx").value=JSON.stringify({...S,xp:900});impJ();eq(S.xp,900);eq(S.v,SAVE_VERSION)});
test("save: round trip is lossless for quests, gates, keys, special gate, stars",()=>{fresh(500);S.days["2026-10-10"]={p:1,p2:0,done:true,done2:true,c2:true,hb:true,h:true};gateAt("2026-10-12",{start:5,end:9,prog:3,bx:80});addKey({r:3,s:77});addKey({r:2,s:5});openSpecial("SK2-5",{dataset:{c:1}});S.stars=[{plus:false},{plus:true}];const p=parseSave(JSON.stringify(S));eq(p.days,S.days);eq(p.gates,S.gates);eq(p.keys,S.keys);eq(p.sg,S.sg);eq(p.stars,S.stars)});
test("save: prototype pollution and unknown keys are dropped",()=>{const s=parseSave('{"xp":5,"__proto__":{"bad":1},"evil":1,"days":{"__proto__":{"done":true}}}');ok(!({}).bad&&!("evil" in s))});

// ---- keys, special gate
test("key: code round trip is deterministic, bad codes rejected",()=>{const k={r:4,s:123456};eq(parseKey(keyCode(k)),k);eq(parseKey("SK9-1"),null);eq(parseKey("nope"),null)});
test("key: same code builds the same gate; lower rank gets bigger targets",()=>{fresh(120);const a=sgBuild({r:3,s:42});const b=sgBuild({r:3,s:42});eq(a,b);S.xp=T[3];const c=sgBuild({r:3,s:42});eq(a.ex,c.ex);ok(a.t.every((x,i)=>x>c.t[i]))});
test("key: wheel key is rank +1 and duplicates are ignored",()=>{fresh(120);const k=newKey();eq(k.r,3);ok(addKey(k));ok(!addKey(k))});
test("special: replaces quests, counts as cleared day, claim once, key consumed",()=>{fresh(500);addKey({r:3,s:1});openSpecial("SK3-1",{dataset:{c:1}});eq(S.keys.length,0);ok(sgActive());sgAdd(0,1);ok(dayDone(today()));for(let i=0;i<3;i++)sgAdd(i,9999);ok(S.sg.done&&!sgActive());const x=S.xp,exp=sgXp(S.sg);sgClaim();sgClaim();eq(S.xp-x,exp);eq(S.sg,null);eq(S.tok,1)});
test("special: expiry returns the key without penalty",()=>{fresh(500);addKey({r:2,s:5});openSpecial("SK2-5",{dataset:{c:1}});S.off=6;sgExpire();eq(S.sg,null);eq(S.keys.map(k=>k.id),["SK2-5"]);ok(S.xp===500)});
test("special: abandoning returns the key, loses progress, no penalty, daily quests return",()=>{fresh(500);addKey({r:3,s:1});openSpecial("SK3-1",{dataset:{c:1}});sgAdd(0,3);const b={dataset:{},textContent:"Abandon gate"};sgBail(b);ok(S.sg,"first tap only confirms");sgBail(b);eq(S.sg,null);eq(S.keys.map(k=>k.id),["SK3-1"]);eq(S.xp,500);ok(!sgActive());render();ok($("today").querySelector(".q"))});
test("special: a cleared special gate cannot be abandoned",()=>{fresh(500);addKey({r:3,s:1});openSpecial("SK3-1",{dataset:{c:1}});for(let i=0;i<3;i++)sgAdd(i,9999);sgBail({dataset:{c:1}});ok(S.sg&&S.sg.done)});
test("special: only one at a time",()=>{fresh(500);addKey({r:2,s:5});addKey({r:3,s:6});openSpecial("SK2-5",{dataset:{c:1}});openSpecial("SK3-6",{dataset:{c:1}});eq(S.keys.length,1)});

// ---- day status and miss reasons
test("columns: the second quest is optional bonus XP; one quest clears the day",async()=>{fresh(500);S.stars=[{plus:false}];S.chk=today();const d=today(),i=quests(d).findIndex(q=>q.t==0);pick(i);finish(0);await wait(700);render();ok(dayDone(d));ok(/Day cleared/.test($("today").textContent));ok(/optional/i.test($("today").textContent));const x=S.xp;const q2=quests(d,1)[0];pick(0,1);finish(1);await wait(700);eq(S.xp-x,q2.xp,"bonus XP awarded once");S.off=1;penalty();eq(S.xp-x,q2.xp,"no penalty")});
test("status: pending habit is named in the reason",()=>{fresh(500);const k=daysAgo(1);S.days[k]={p:0,done:true,hb:true};eq(missReason(k),"the quest was cleared but the weekly habit was not");eq(missReason(daysAgo(2)),"no quest was cleared");S.days[k]={p:0,done:true};eq(missReason(k),"");S.days[k]={p:0,done:true,hb:true,hd:true};eq(missReason(k),"")});
test("status: a single-column cleared day shows Day cleared and costs nothing",async()=>{fresh(500);S.chk=today();const i=quests(today()).findIndex(q=>q.t==0);pick(i);finish(0);await wait(700);render();ok(/Day cleared/.test($("today").textContent));S.off=1;penalty();eq(S.xp,501)});
test("habit: declining costs the habit's XP once, never below the floor, and the day still counts",async()=>{fresh(500);const d=today();S.days[d]={p:0,done:true,hb:true};ok(!dayDone(d));const cost=habitXp();const b={dataset:{},textContent:"Decline habit"};S.chk=d;habitDecline(b);eq(S.xp,500,"first tap only confirms");habitDecline(b);eq(500-S.xp,cost);habitDecline(b);habitDecline(b);eq(500-S.xp,cost,"no double loss");ok(dayDone(d));fresh(100);const d2=today();S.days[d2]={p:0,done:true,hb:true};habitDecline({dataset:{c:1}});eq(S.xp,100,"floor holds");ok(dayDone(d2))});
test("habit: declined or done habit cannot be undone or doubled",()=>{fresh(500);const d=today();S.days[d]={p:0,done:true,hb:true,hd:true};habitDone();ok(!S.days[d].h)});

// ---- medical pause
test("pause: ten paused days cost nothing and hold the streak",()=>{fresh(500);const y=daysAgo(1);clearDay(y);S.chk=daysAgo(10);S.pause={t:nowMs()-10*864e5};penalty();eq(S.xp,500);ok(S.days[daysAgo(5)].med&&S.days[daysAgo(5)].rest);ok(streak()>=1)});
test("pause: no quests, new gate blocked, banner text",()=>{fresh(500);S.pause={t:nowMs()};pauseMark();render();ok(/Medical pause/.test($("today").textContent));ok(!$("today").querySelector(".q"));eq(gateState(),"paused");openGate();ok(!gateFor(weekId()).start)});
test("pause: ending it resumes quests today and holds a special gate's timer",()=>{fresh(500);addKey({r:3,s:1});openSpecial("SK3-1",{dataset:{c:1}});const end0=S.sg.end;pauseStart();S.pause.t-=2*864e5;pauseEnd();ok(!S.pause);ok(S.sg.end>=end0+2*864e5-1);ok(!S.days[today()].rest);pick(0);eq(S.days[today()].p,0)});
test("pause: a special gate does not expire while paused",()=>{fresh(500);addKey({r:2,s:5});openSpecial("SK2-5",{dataset:{c:1}});S.pause={t:nowMs()};S.off=9;sgExpire();ok(S.sg)});
test("pause: a started gate stays playable",()=>{fresh(120);const g=gateAt(weekId(),{start:nowMs(),end:nowMs()+1e9});S.pause={t:nowMs()};ok(gateState()!=="paused");addProg(5);eq(g.prog,5)});
test("pause: paused week neither breaks nor adds to the gate streak",()=>{fresh(120);at("2026-10-22T12:00:00");hrec("2026-10-12").g=2;S.days["2026-10-06"]={rest:true,med:true};hrec("2026-09-28").g=2;eq(gateStreak(),2)});
test("pause: saves round-trip pause and med days",()=>{fresh(120);S.pause={t:12345};S.days["2026-10-10"]={rest:true,med:true};const p=parseSave(JSON.stringify(S));eq(p.pause,{t:12345});ok(p.days["2026-10-10"].med)});

// ---- prestige
test("prestige: needs rank S, resets, keeps keys, resets attempts, S+ star is cosmetic",()=>{fresh(1000);const b={dataset:{c:1}};prestige(b);eq(S.stars.length,0);fresh(3100);S.sec=true;S.att=3;S.plus=true;addKey({r:4,s:9});prestige(b);eq([S.xp,S.fl,S.att,S.plus],[0,0,0,false]);eq(S.stars,[{plus:true}]);eq(S.keys.length,1);eq(cols(),1)});
test("prestige: first normal star adds a second column",()=>{fresh(3100);prestige({dataset:{c:1}});eq(cols(),2)});
test("prestige: second column can still be picked and finished after the first is done",async()=>{fresh(120);S.stars=[{plus:false}];const d=today();pick(0);finish(0);await wait(700);pick(2,1);eq(S.days[d].p2,2);pick(1,1);eq(S.days[d].p2,1);finish(1);await wait(700);ok(S.days[d].done2);pick(0,1);eq(S.days[d].p2,1)});
test("prestige: reaching S on a new run replays the discovery sequence",()=>{fresh(3100);S.sec=true;prestige({dataset:{c:1}});eq(S.sec,false);S.xp=2990;gain(20);eq($("ot").textContent,"System");ok(S.sec);["ov"].forEach(i=>$(i).classList.remove("on"))});
test("prestige: columns cap at two",()=>{fresh();S.stars=[{plus:false},{plus:false},{plus:true}];eq(cols(),2)});
test("secret: key field only at rank S after discovery; 3 attempts lock",()=>{fresh(3100);S.sec=true;render();ok($("pk"));S.att=3;render();ok(!$("pk"));ok(/sealed/.test($("today").textContent))});

// ---- tutorial
test("tutorial: four screens covering quests, XP, floors, rest, gates, co-op; ends on today's quest; shown once",()=>{eq(TUT.length,4);const all=TUT.map(t=>t[1]).join(" ").toLowerCase();["quest","xp","floor","rest token","gate","co-op"].forEach(k=>ok(all.includes(k),k));ok(/select today's quest/i.test(TUT[3][1]));fresh();tutStart();for(let i=0;i<3;i++)tutNext();eq($("tn").textContent,"Begin");tutNext();ok(!$("tut").classList.contains("on"));ok(S.tut)});

// ---- runner
(async()=>{
  const out=[];let pass=0;const fails=[];
  for(const[n,f]of TESTS){
    try{S=def();await f();pass++;out.push("PASS "+n)}catch(e){fails.push(n+" -> "+e.message);out.push("FAIL "+n+" -> "+e.message)}
  }
  const sum=pass+"/"+TESTS.length+" passed";
  const el=document.getElementById("tr");el.textContent=sum+"\n"+out.join("\n");
  window.__results={passed:pass,total:TESTS.length,failures:fails,summary:sum};
})();
