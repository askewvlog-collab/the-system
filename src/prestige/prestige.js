// Prestige: from rank S (or S+), reset to EE and gain one permanent star. Special keys are kept.
// A star earned from S+ is gold with a plus marker and is cosmetic only. Stars are never lost.
// Attempts at the secret key reset on every prestige, so there is no permanent lockout. The discovery sequence replays when the new run reaches S.
const starsText=()=>S.stars.map(s=>s.plus?"★+":"★").join(" ");
function prestigeHtml(r){
  if(r<6)return"";
  const first=!S.stars.some(s=>!s.plus);
  return `<div class="w v"><h2>Prestige</h2><div class="mu">Reset to rank EE and gain a permanent star. Special keys are kept.${S.plus?" You hold S+: this star is gold with a plus marker and gives no benefit.":first?" Your first star adds a second daily-quest column. Further stars are cosmetic.":" Further stars are cosmetic."}</div><button style="margin-top:8px" onclick="prestige(this)">Prestige</button></div>`;
}
function prestige(b){
  if(ri()<6)return;
  if(!b.dataset.c){b.dataset.c="1";b.textContent="Tap again: resets rank to EE";setTimeout(()=>{b.dataset.c="";b.textContent="Prestige"},4000);return}
  const plus=S.plus===true;
  S.stars.push({plus});S.xp=0;S.fl=0;S.att=0;S.plus=false;S.sec=false;S.pend=null; // sec reset: reaching S again replays the discovery sequence
  save();render();banner("Prestige",plus?"★+":"★","Rank reset to EE. A permanent star is recorded.");
}
