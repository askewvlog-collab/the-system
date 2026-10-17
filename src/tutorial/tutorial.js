// First-open tutorial (4 screens). Skippable, shown once (S.tut), replayable from Setup.
const TUT=[
["Daily quests","Three quests are issued each day. Select one and complete it. Easy holds the streak. Harder quests pay more XP. A day without a cleared quest costs XP: one penalty per return. The (i) button shows each movement and its form."],
["Ranks and rest","XP raises your rank: EE, E, D, C, B, A, S. A reached rank is a floor. XP may fall, rank will not. Exception: S can fall to A. Rest tokens, up to 2, hold your streak and prevent XP loss. If you are ill or injured, Setup has a medical pause."],
["Gates","Clear 5 quest days in a week at rank D or higher. The gate opens Friday 18:00 and expires Sunday midnight. A cleared gate unlocks the reward wheel, which can drop a rare special key and rest tokens."],
["Co-op and begin","Co-op: a friend's code swaps your gate for a shared one. Each of you completes half of the reps, partner reps are self-reported, and you earn full XP. A joined gate can be left before starting. Select today's quest."]
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
