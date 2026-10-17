// First-open tutorial. Skippable, shown once (S.tut), replayable from Setup.
const TUT=[
["System online","Player registered. Rank: EE. A short orientation follows. You may skip it."],
["Daily quests","Three quests are issued each day. Select one and complete it. Easy holds the streak. Harder quests pay more XP. The (i) button shows the movement and its form."],
["XP and rank","XP raises your rank: EE, E, D, C, B, A, S. A day without a cleared quest costs XP. One penalty applies per return, however long the absence."],
["Rank floors","A rank, once reached, becomes your floor. XP may fall, rank will not. Exception: rank S can fall back to A. Maintain it."],
["Rest tokens","Clearing a gate yields a rest token, up to 2. Spend one to hold your streak and lose no XP. A rest day does not count toward the 5 cleared days."],
["Gates","Clear 5 quest days in a week at rank D or higher. The gate opens Friday 18:00 and expires Sunday midnight. A cleared gate unlocks the reward wheel."],
["Co-op","A friend's code swaps your gate for a shared one. Each of you completes half of the reps. Partner reps are self-reported. You earn full XP. A joined gate may be left before starting, without penalty."],
["Orientation complete","Proceed."]
];
let tutI=0;
function tutShow(){
  $("tut").classList.add("on");const[t,m]=TUT[tutI];
  $("tt").textContent=t;$("tm").textContent=m;$("tc").textContent=(tutI+1)+" / "+TUT.length;
  $("tn").textContent=tutI==TUT.length-1?"Begin":"Next";$("tn").focus();
}
function tutStart(){tutI=0;tutShow()}
function tutNext(){if(tutI>=TUT.length-1)return tutEnd();tutI++;tutShow()}
function tutEnd(){$("tut").classList.remove("on");if(!S.tut){S.tut=true;save()}}
