// XP, ranks, missed-day penalty.
const R=["EE","E","D","C","B","A","S"],T=[0,30,100,250,600,1400,3000];
const ri=()=>{let r=0;T.forEach((t,i)=>{if(S.xp>=t)r=i});return r};
const scale=()=>1+ri()*.4;
// Rank floors: a reached rank is a floor. Only S can fall, and only to A (index 5).
const floorIdx=()=>Math.min(5,Math.max(S.fl||0,0));
function raiseFloor(){const f=Math.min(5,ri());if(f>(S.fl||0))S.fl=f}
// Remove XP without dropping below the floor. Returns the XP actually lost.
function loseXp(n){const min=T[floorIdx()],l=Math.max(0,Math.min(n,S.xp-min));S.xp-=l;return l}
function penalty(){
  sgExpire();raiseFloor();const t=today();if(!S.chk){S.chk=t;save();return}
  // One ordinary missed-day penalty per return, however long the absence.
  let d=new Date(S.chk+"T12:00:00"),missed=0,n=0;
  while(ds(d)<t&&n<400){if(!dayDone(ds(d))&&!(S.days[ds(d)]&&S.days[ds(d)].rest))missed++;d.setDate(d.getDate()+1);n++}
  S.chk=t;
  if(missed&&!S.pend){
    const amt=2+ri()*2,loss=Math.min(amt,S.xp-T[floorIdx()]);
    if(loss>0&&(S.tok||0)>0){S.pend={n:amt,m:missed};save();pendShow();return} // player chooses: spend a token or lose the XP
    if(loss>0)applyPenalty(amt,missed);
  }
  save();
}
function applyPenalty(n,missed){const lost=loseXp(n);if(!lost)return;histAdd("xl",lost);save();banner("Penalty","−"+lost+" XP",missed>1?"You were absent "+missed+" days. One penalty applied.":"You missed a day. Quests cost XP when skipped.")}
// Return after missed days with a token in hand: spend it to lose no XP, or lose the XP and keep the token.
function pendShow(){const p=S.pend;if(!p)return;const loss=Math.max(0,Math.min(p.n,S.xp-T[floorIdx()]));$("pnm").textContent=(p.m>1?"You were absent "+p.m+" days. ":"You missed a day. ")+"One penalty applies: −"+loss+" XP. Spend a rest token (you have "+(S.tok||0)+") to lose nothing, or accept the loss and keep the token.";$("pn").classList.add("on")}
function pendResolve(spend){const p=S.pend;if(!p)return;S.pend=null;$("pn").classList.remove("on");if(spend&&(S.tok||0)>0){S.tok--;save();toast("Rest token spent. No XP lost.")}else applyPenalty(p.n,p.m);save();render()}
// Applies XP at once (so a closed app never loses a claimed reward). defer=true postpones the banner: call announce(result) later.
function gain(x,defer){const b=ri();S.xp+=x;histAdd("xp",x);raiseFloor();save();const r={b,a:ri()};if(!defer)announce(r);return r}
function announce(r){if(r.a>r.b){if(r.a==6&&!S.sec)secretSeq();else banner("Rank up","Rank "+R[r.a],"You reached rank "+R[r.a]+". Challenges are now harder.")}}
