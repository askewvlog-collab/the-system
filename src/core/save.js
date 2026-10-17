// Save format, migrations, validation. A bad import or corrupt save never replaces a good one.
// v1 = original build. v2 = adds the rank floor (fl). v3 = adds weekly summary records (hist). v4 = adds special keys, pending penalty choice. v5 = adds prestige stars. Add one MIGRATIONS step per version bump,
// and add every new state field to sanitize() or it is dropped on load/import.
const SAVE_VERSION=5;
const MIGRATIONS={1:o=>({...o,fl:0,v:2}),2:o=>({...o,hist:{},v:3}),3:o=>({...o,keys:[],v:4}),4:o=>({...o,stars:[],v:5})};
const DATE=/^\d{4}-\d\d-\d\d$/,HM=/^([01]\d|2[0-3]):[0-5]\d$/;
const isObj=x=>!!x&&typeof x==="object"&&!Array.isArray(x);
const num=(x,lo,hi,d)=>typeof x==="number"&&isFinite(x)?Math.min(hi,Math.max(lo,x)):d;
const int=(x,lo,hi,d)=>Number.isInteger(x)&&x>=lo&&x<=hi?x:d;
function cleanGate(g){
  if(!isObj(g))return null;
  const o={p:int(g.p,0,3,0),kr:int(g.kr,0,6,0),start:g.start==null?null:num(g.start,0,1e15,null),prog:num(g.prog,0,1e6,0),done:g.done===true,coop:g.coop===true,paid:g.paid===true};
  if(g.pp!=null)o.pp=num(g.pp,0,9999,0);if(g.end!=null)o.end=num(g.end,0,1e15,undefined);if(g.bx!=null)o.bx=num(g.bx,0,1e6,undefined);
  return o;
}
function sanitize(o){
  const s=def();s.xp=num(o.xp,0,1e7,0);s.fl=int(o.fl,0,5,0);s.chk=DATE.test(o.chk)?o.chk:null;
  if(isObj(o.days))for(const k of Object.keys(o.days)){const e=o.days[k];if(DATE.test(k)&&isObj(e)){const d={};
    if(e.p!=null)d.p=int(e.p,0,2,undefined);if(e.p2!=null)d.p2=int(e.p2,0,2,undefined);for(const f of["done","hb","h","rest","sg","c2","done2"])if(e[f]===true)d[f]=true;s.days[k]=d}}
  if(isObj(o.gates))for(const k of Object.keys(o.gates)){const g=cleanGate(o.gates[k]);if(DATE.test(k)&&g)s.gates[k]=g}
  const c=cleanGate(o.co);if(c&&DATE.test(o.co.w)){c.w=o.co.w;s.co=c}
  if(isObj(o.win)){if(HM.test(o.win.s))s.win.s=o.win.s;if(HM.test(o.win.e))s.win.e=o.win.e;s.win.len=int(o.win.len,1,2,2)}
  if(isObj(o.hist))for(const k of Object.keys(o.hist)){const r=o.hist[k];if(DATE.test(k)&&isObj(r))s.hist[k]={c:int(r.c,0,7,0),xp:num(r.xp,0,1e7,0),xl:num(r.xl,0,1e7,0),v:num(r.v,0,1e7,0),st:int(r.st,0,1e5,0),g:int(r.g,0,2,0),bp:[0,1,2,3].map(i=>int(Array.isArray(r.bp)?r.bp[i]:0,0,1e4,0))}}
  if(isObj(o.pend)&&typeof o.pend.n==='number'&&isFinite(o.pend.n))s.pend={n:num(o.pend.n,0,1e4,0),m:int(o.pend.m,1,1e4,1)};
  if(Array.isArray(o.keys))for(const k of o.keys.slice(0,20)){if(isObj(k)){const r=int(k.r,0,6,-1),sd=int(k.s,0,36**6-1,-1);if(r>=0&&sd>=0&&!s.keys.some(x=>x.r===r&&x.s===sd))s.keys.push({id:keyCode({r,s:sd}),r,s:sd})}}
  if(isObj(o.sg)){const g=o.sg,r=int(g.r,0,6,-1),sd=int(g.s,0,36**6-1,-1);
    if(r>=0&&sd>=0&&Array.isArray(g.ex)&&g.ex.length===3&&g.ex.every(x=>EX[x])&&Array.isArray(g.t)&&Array.isArray(g.p))
      s.sg={id:keyCode({r,s:sd}),r,s:sd,start:num(g.start,0,1e15,0),end:num(g.end,0,1e15,0),ex:g.ex.slice(),t:[0,1,2].map(i=>int(g.t[i],1,9999,1)),p:[0,1,2].map(i=>int(g.p[i],0,9999,0)),run:g.run===true,done:g.done===true,bx:num(g.bx,0,1e6,0)}}
  if(Array.isArray(o.stars))s.stars=o.stars.slice(0,99).filter(isObj).map(x=>({plus:x.plus===true}));
  s.tok=int(o.tok,0,2,0);s.att=int(o.att,0,3,0);
  if(o.rem===0||o.rem===1)s.rem=o.rem;
  for(const f of["plus","sec","tut"])if(o[f]===true)s[f]=true;
  if(typeof o.jm==="string")s.jm=o.jm.slice(0,200);
  return s;
}
// Text -> clean current-version state, or throws Error with a short reason.
function parseSave(text){
  let o;try{o=JSON.parse(text)}catch(e){throw new Error("Not valid data")}
  if(!isObj(o))throw new Error("Not a save");
  if(typeof o.xp!=="number"||!isFinite(o.xp)||o.xp<0)throw new Error("No valid XP");
  let v=o.v===undefined?1:o.v;
  if(!Number.isInteger(v)||v<1)throw new Error("Unknown version");
  if(v>SAVE_VERSION)throw new Error("Save is from a newer version");
  while(v<SAVE_VERSION){o=MIGRATIONS[v](o);v=o.v}
  return sanitize(o);
}
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
// Keep the current save under a side key before anything replaces it.
const keepPrev=()=>{const c=store.get(SAVE_KEY);if(c)store.set(SAVE_KEY+".prev",c)};
let loadNote=null;
function loadSave(){
  const raw=store.get(SAVE_KEY);if(!raw)return def();
  try{
    const o=parseSave(raw),v=(JSON.parse(raw).v||1);
    if(v<SAVE_VERSION&&store.get(SAVE_KEY+".v"+v)===null)store.set(SAVE_KEY+".v"+v,raw); // pre-migration copy
    return o;
  }catch(e){store.set(SAVE_KEY+".bad",raw);loadNote="Saved data could not be read. A copy was kept. Starting fresh.";return def()}
}
