// State, save/load, dates, seeded random.
const $=id=>document.getElementById(id);
const def=()=>({v:SAVE_VERSION,xp:0,fl:0,chk:null,days:{},gates:{},hist:{},keys:[],stars:[],win:{s:"17:00",e:"19:00"}});
let S; // loaded at boot (main.js) once every module is defined
const SAVE_KEY=window.__SAVEKEY||"gate1"; // the dev build uses its own key so it never touches a real save
const save=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}};
const ds=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const now=()=>new Date(Date.now()+((S.off||0)*864e5)); // S.off only exists in automated tests (time travel)
const today=()=>ds(now());const nowMs=()=>now().getTime();
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h};
function rnd(seed){let a=hash(seed);return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function weekId(d=now()){const x=new Date(d);const k=(x.getDay()+6)%7;x.setDate(x.getDate()-k);return ds(x)}
