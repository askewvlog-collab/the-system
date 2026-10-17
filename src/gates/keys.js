// Special keys: rare wheel prize, permanent until used, shareable via a deterministic code.
// Code format SK<rank 0-6>-<seed base36>: same code = same special gate (see special.js).
const KEYRANK=["EE","E","D","C","B","A","S"];
// Flame/electric color per key rank (EE..S).
const KC=["#8f93bd","#5cc8ff","#3ddc97","#ffd23d","#ff8a3d","#ff4a3d","#c06bff"];
const KEY_SLOT=4,KEY_W=.3; // one wheel slot of 8; weight .3 vs 1 for the others = about 4% odds
const keyCode=k=>"SK"+k.r+"-"+k.s.toString(36);
function parseKey(v){const m=/^SK([0-6])-([0-9a-z]{1,6})$/i.exec(String(v).trim());if(!m)return null;const s=parseInt(m[2].toLowerCase(),36);return s>=0&&s<36**6?{r:+m[1],s}:null}
function addKey(k){const id=keyCode(k);if(S.keys.length>=20||S.keys.some(x=>x.id===id))return false;S.keys.push({id,r:k.r,s:k.s});return true}
const newKey=()=>({r:Math.min(6,ri()+1),s:Math.floor(Math.random()*36**4)}); // key rank = player's rank + 1
function keysHtml(){
  const sg=S.sg;if(!S.keys.length&&!sg)return"";
  const rows=S.keys.map(k=>`<div class="kr" style="--c:${KC[k.r]}"><span class="key" style="background:${KC[k.r]}"></span><b>Rank ${KEYRANK[k.r]} key</b><input class="kc" readonly value="${k.id}" onclick="this.select()" aria-label="Key code">${sg?"":`<button class="go" onclick="openSpecial('${k.id}',this)">Enter</button>`}</div>`).join("");
  return (sg?sgHtml():"")+(S.keys.length?`<div class="w v"><h2>Special gates</h2><div class="mu">Keys are permanent until used. Share a key's code with 1 or 2 friends: the same code opens the same gate.${sg?" Finish the active special gate first.":""}</div>${rows}</div>`:"");
}
