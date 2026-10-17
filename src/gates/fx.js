// Gate entry and clear sequences. All art is original and drawn in code (canvas): no images, no copied assets.
// Entry: gate doors part and reveal a slowly drifting scene (red hellscape, purple thunderstorm, yellow speed rush).
// Clear: the scene collapses, shatters into shards, and one shard flies to the rest-token counter.
// Skippable (tap or Escape) and skipped entirely under prefers-reduced-motion.
const FXC={hell:"#ff4a3d",storm:"#a07bff",speed:"#ffd23d"};
const fxReduced=()=>window.__noFx||matchMedia("(prefers-reduced-motion:reduce)").matches;
const clamp01=x=>Math.max(0,Math.min(1,x)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
// Scene by body part for weekly gates (legs yellow, chest red, others purple); by key rank for special gates.
const fxKind=g=>g.ex?(g.r>=5?"hell":g.r>=3?"storm":"speed"):(g.p==0?"speed":g.p==1?"hell":"storm");
const fxLabel=g=>g.ex?"Special gate · rank "+KEYRANK[g.r]:PT[g.p].n+" gate · rank "+R[g.kr];

function fxParts(kind,w,h){const r=rnd("fx"+kind),P=[];const n=kind=="storm"?90:kind=="hell"?70:70;for(let i=0;i<n;i++)P.push({a:r(),b:r(),c:r(),d:r(),e:r()});return P}
function fxScene(ctx,w,h,t,kind,P){
  if(kind=="hell"){
    let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#100202");g.addColorStop(.55,"#4a0b08");g.addColorStop(1,"#a3200f");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    g=ctx.createRadialGradient(w*.5,h*.62,0,w*.5,h*.62,h*.55);g.addColorStop(0,"rgba(255,110,40,.45)");g.addColorStop(1,"rgba(255,60,20,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let L=0;L<3;L++){ctx.fillStyle=["#2a0504","#1a0303","#0a0101"][L];ctx.beginPath();ctx.moveTo(0,h);for(let x=0;x<=w+8;x+=8){const o=t*.012*(L+1)+L*90;ctx.lineTo(x,h*(.62+L*.1)-Math.abs(Math.sin((x+o)*.011*(L+1)))*h*.12*(1+L*.3)-Math.sin((x+o)*.037)*h*.02)}ctx.lineTo(w,h);ctx.fill()}
    P.forEach(p=>{const y=((p.b*h-t*(.02+p.c*.05))%h+h)%h,x=p.a*w+Math.sin(t*.001*(1+p.d)+p.e*6)*18,a=.25+.6*p.d;ctx.fillStyle="rgba(255,"+(110+p.e*90|0)+",50,"+a+")";ctx.beginPath();ctx.arc(x,y,1+p.c*2.2,0,7);ctx.fill()});
  }else if(kind=="storm"){
    let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#05010f");g.addColorStop(.6,"#1b0a45");g.addColorStop(1,"#3a1a80");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<7;i++){const p=P[i],x=((p.a*(w+500)+t*.012*(.5+p.c))%(w+500))-250,y=p.b*h*.55,r=h*(.18+p.d*.18);g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(70,35,140,.6)");g.addColorStop(1,"rgba(40,15,90,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
    ctx.strokeStyle="rgba(180,160,255,.22)";ctx.lineWidth=1;ctx.beginPath();for(let i=10;i<P.length;i++){const p=P[i],x=((p.a*w-t*.08*(.6+p.c))%w+w)%w,y=((p.b*h+t*.5*(.7+p.d))%h);ctx.moveTo(x,y);ctx.lineTo(x-4,y+14)}ctx.stroke();
    const k=Math.floor(t/800),ph=t-k*800;if(ph<140){const r2=rnd("bolt"+k);ctx.save();ctx.globalAlpha=1-ph/140;ctx.fillStyle="rgba(190,160,255,.18)";ctx.fillRect(0,0,w,h);ctx.strokeStyle="#fff";ctx.shadowColor="#b890ff";ctx.shadowBlur=22;ctx.lineWidth=2.5;ctx.beginPath();let x=w*(.2+r2()*.6),y=0;ctx.moveTo(x,y);while(y<h*.7){x+=(r2()-.5)*60;y+=20+r2()*30;ctx.lineTo(x,y)}ctx.stroke();ctx.restore()}
  }else{
    ctx.fillStyle="#070500";ctx.fillRect(0,0,w,h);const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)*.6);g.addColorStop(0,"rgba(255,210,61,.35)");g.addColorStop(1,"rgba(255,160,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.lineCap="round";const R0=Math.hypot(w,h)/2;P.forEach(p=>{const ang=p.a*Math.PI*2,q=((t*.00045*(.6+p.c)+p.b)%1),r=q*q*R0,len=8+q*q*R0*.35;ctx.strokeStyle="rgba(255,"+(190+p.d*50|0)+",60,"+(.15+q*.8)+")";ctx.lineWidth=.6+q*2.2;ctx.beginPath();ctx.moveTo(w/2+Math.cos(ang)*r,h/2+Math.sin(ang)*r);ctx.lineTo(w/2+Math.cos(ang)*(r+len),h/2+Math.sin(ang)*(r+len));ctx.stroke()});
  }
}
const ENTER_MS=3400;
function fxEnter(ctx,w,h,t,kind,P,label){
  const c=FXC[kind];fxScene(ctx,w,h,t,kind,P);
  const p=ease(clamp01(t/1100));
  if(p<1){const gw=p*w/2,L=w/2-gw;
    ctx.fillStyle="#07050f";ctx.fillRect(0,0,L,h);ctx.fillRect(w/2+gw,0,L+1,h);
    ctx.strokeStyle="rgba(255,255,255,.05)";ctx.lineWidth=1;for(let y=0;y<h;y+=46){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(L,y);ctx.moveTo(w/2+gw,y);ctx.lineTo(w,y);ctx.stroke()}
    ctx.save();ctx.shadowColor=c;ctx.shadowBlur=24;ctx.fillStyle=c;ctx.fillRect(L-2,0,2,h);ctx.fillRect(w/2+gw,0,2,h);ctx.restore();
    if(p<.02){ctx.save();ctx.shadowColor=c;ctx.shadowBlur=30;ctx.fillStyle=c;ctx.fillRect(w/2-1,0,2,h);ctx.restore()}
  }
  const a=clamp01((t-1300)/600)*clamp01((ENTER_MS-t)/400);
  if(a>0){ctx.save();ctx.globalAlpha=a;ctx.textAlign="center";ctx.fillStyle="#e6eaff";ctx.shadowColor=c;ctx.shadowBlur=18;ctx.font="600 13px system-ui,sans-serif";ctx.fillText("GATE ENTERED",w/2,h*.44);ctx.font="600 26px system-ui,sans-serif";ctx.fillText(label,w/2,h*.44+38);ctx.restore()}
}
const CLEAR_MS=3200,COLL=900;
function fxClearInit(w,h,kind,P,tgt){
  const sn=document.createElement("canvas");sn.width=w;sn.height=h;const s=sn.getContext("2d");
  s.fillStyle="#000";s.fillRect(0,0,w,h);s.save();s.translate(w/2,h/2);s.scale(.55,.55);s.translate(-w/2,-h/2);fxScene(s,w,h,5000,kind,P);s.restore();
  const r=rnd("shard"+kind),cols=8,rows=12,pts=[];
  for(let j=0;j<=rows;j++){pts.push([]);for(let i=0;i<=cols;i++){const edge=i==0||j==0||i==cols||j==rows;pts[j].push([i/cols*w+(edge?0:(r()-.5)*w/cols*.6),j/rows*h+(edge?0:(r()-.5)*h/rows*.6)])}}
  const sh=[];for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=pts[j][i],b=pts[j][i+1],c=pts[j+1][i+1],d=pts[j+1][i];[[a,b,c],[a,c,d]].forEach(T=>{const cx=(T[0][0]+T[1][0]+T[2][0])/3,cy=(T[0][1]+T[1][1]+T[2][1])/3,dx=cx-w/2,dy=cy-h/2,m=Math.hypot(dx,dy)||1;sh.push({T,cx,cy,vx:dx/m*(120+r()*200),vy:dy/m*(120+r()*200)-60,g:380+r()*240,sp:(r()-.5)*7})})}
  let tok=0,best=1e9;sh.forEach((s2,i)=>{const d=Math.hypot(s2.cx-w/2,s2.cy-h/2);if(d<best){best=d;tok=i}});
  const cr=[];for(let k=0;k<9;k++){const ang=r()*7;let x=w/2,y=h/2;const seg=[[x,y]];for(let n=0;n<7;n++){x+=Math.cos(ang+(r()-.5))*h*.07;y+=Math.sin(ang+(r()-.5))*h*.07;seg.push([x,y])}cr.push(seg)}
  return{sn,sh,tok,cr,tgt};
}
function fxClear(ctx,w,h,t,kind,P,st){
  const c=FXC[kind];ctx.fillStyle="#000";ctx.fillRect(0,0,w,h);
  if(t<COLL){const p=ease(t/COLL);ctx.save();ctx.translate(w/2+(Math.random()-.5)*8*p,h/2+(Math.random()-.5)*8*p);ctx.scale(1-.45*p,1-.45*p);ctx.translate(-w/2,-h/2);fxScene(ctx,w,h,5000+t,kind,P);ctx.restore();
    ctx.strokeStyle="rgba(255,255,255,"+(.3+.6*p)+")";ctx.lineWidth=1.4;st.cr.forEach(seg=>{const n=Math.max(1,Math.floor(seg.length*p));ctx.beginPath();ctx.moveTo(seg[0][0],seg[0][1]);for(let i=1;i<n;i++)ctx.lineTo(seg[i][0],seg[i][1]);ctx.stroke()});return}
  const q=clamp01((t-COLL)/(CLEAR_MS-COLL)),s=(t-COLL)/1000;
  st.sh.forEach((o,i)=>{if(i===st.tok)return;ctx.save();ctx.globalAlpha=1-q*q;ctx.translate(o.cx+o.vx*s,o.cy+o.vy*s+o.g*s*s);ctx.rotate(o.sp*s);ctx.translate(-o.cx,-o.cy);ctx.beginPath();ctx.moveTo(o.T[0][0],o.T[0][1]);ctx.lineTo(o.T[1][0],o.T[1][1]);ctx.lineTo(o.T[2][0],o.T[2][1]);ctx.closePath();ctx.clip();ctx.drawImage(st.sn,0,0,w,h);ctx.restore()});
  const o=st.sh[st.tok],f=ease(clamp01((q-.15)/.8)),x=o.cx+(st.tgt.x-o.cx)*f,y=o.cy+(st.tgt.y-o.cy)*f-Math.sin(f*Math.PI)*60,sz=26*(1-.6*f);
  ctx.save();ctx.translate(x,y);ctx.rotate(f*6);ctx.shadowColor="#5cc8ff";ctx.shadowBlur=20;ctx.fillStyle="#bfe9ff";ctx.beginPath();ctx.moveTo(0,-sz);ctx.lineTo(sz*.8,sz*.6);ctx.lineTo(-sz*.8,sz*.6);ctx.closePath();ctx.fill();ctx.restore();
  const a=clamp01((q-.2)/.25)*clamp01((1-q)/.25);if(a>0){ctx.save();ctx.globalAlpha=a;ctx.textAlign="center";ctx.fillStyle="#e6eaff";ctx.shadowColor=c;ctx.shadowBlur=18;ctx.font="600 26px system-ui,sans-serif";ctx.fillText("GATE CLEARED",w/2,h*.4);ctx.restore()}
}
// kind: "enter" | "clear". g: weekly gate or special gate object. done runs after the sequence (or at once when skipped / reduced motion).
let fxBusy=false;
function gateFx(mode,g,done){
  if(fxReduced()||fxBusy){done&&done();return}
  fxBusy=true;const wrap=$("fxw"),cv=$("fx"),dpr=Math.min(2,window.devicePixelRatio||1),w=innerWidth,h=innerHeight;
  cv.width=w*dpr;cv.height=h*dpr;const ctx=cv.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);
  const kind=fxKind(g),P=fxParts(kind,w,h);let st=null,t0=performance.now(),raf=0,ended=false;
  const rt=$("rt"),tgtEl=rt&&rt.offsetParent?rt:document.querySelector("#nv button"),tr=tgtEl.getBoundingClientRect();
  if(mode=="clear")st=fxClearInit(w,h,kind,P,{x:tr.left+tr.width/2,y:tr.top+tr.height/2});
  const total=mode=="enter"?ENTER_MS:CLEAR_MS;
  const end=()=>{if(ended)return;ended=true;cancelAnimationFrame(raf);wrap.classList.remove("on");removeEventListener("keydown",key);wrap.onclick=null;fxBusy=false;
    if(mode=="clear")tgtEl.animate([{transform:"scale(1)",boxShadow:"0 0 0 #5cc8ff"},{transform:"scale(1.15)",boxShadow:"0 0 24px #5cc8ff"},{transform:"scale(1)",boxShadow:"0 0 0 #5cc8ff"}],{duration:600});
    done&&done()};
  const key=e=>{if(e.key=="Escape"||e.key=="Enter")end()};
  addEventListener("keydown",key);wrap.onclick=end;wrap.classList.add("on");
  const loop=now=>{if(ended)return;const t=now-t0;if(t>=total)return end();ctx.clearRect(0,0,w,h);if(mode=="enter")fxEnter(ctx,w,h,t,kind,P,fxLabel(g));else fxClear(ctx,w,h,t,kind,P,st);raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);
}
