// All exercise data lives here. To add an exercise, add one entry to EX: quests, gates and the info panel pick it up.
// part: 0 Legs, 1 Chest, 2 Core, 3 Back. med: [min,max] reps for a medium quest at rank EE.
// fr: stick-figure frames (start, middle, end), side view on an 80x60 canvas, floor at y=56. Each frame lists joint
// points: head, neck, pelvis, elbow, wrist, knee, foot [, knee2, foot2]. mirror:true draws the same limbs mirrored
// about the pelvis (front-view moves). All figures are original, drawn as inline SVG, so they work offline.
const PU=[[14,26,18,29,45,38,18,42,18,54,60,46,72,54],[14,35,18,38,45,43,26,46,18,54,60,48,72,54],[14,44,18,46,45,48,28,50,18,54,60,51,72,54]]; // side-view push-up frames, shared by the width variations
const EX={
squats:{nm:"squats",part:0,med:[12,20],
 d:"Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair, then stand tall again.",
 cues:["Knees track over your toes, not caving inward","Chest up, back flat","Heels stay on the floor","Go only as low as you can control"],
 easier:"Squat to a chair: sit down lightly, then stand up.",
 fr:[[40,10,40,16,40,32,46,20,52,19,40,44,40,56],[39,16,38,22,32,38,48,24,54,23,46,42,40,56],[39,22,37,28,28,44,48,28,54,27,48,44,40,56]]},
lunges:{nm:"lunges",part:0,med:[10,16],
 d:"Step one foot forward and lower until both knees bend about 90 degrees. Push back to standing and switch legs. Count each step as one rep.",
 cues:["Front knee stays above the ankle","Torso upright","Back knee lowers toward the floor without slamming","Take a step long enough to keep balance"],
 easier:"Hold a wall or chair for balance and make the step shorter.",
 fr:[[40,10,40,16,40,32,44,24,40,34,40,44,40,56,40,44,40,56],[40,16,40,22,40,36,44,28,40,34,52,42,54,56,32,50,24,56],[40,24,40,30,40,44,44,36,40,42,54,46,54,56,32,54,22,56]]},
jumping_jacks:{nm:"jumping jacks",part:0,med:[20,30],mirror:true,
 d:"Jump your feet wide while swinging your arms overhead, then jump back to standing with arms at your sides.",
 cues:["Land softly on the balls of your feet","Keep knees slightly bent","Breathe steadily","Keep a rhythm you can hold"],
 easier:"Step one foot out at a time and raise your arms, no jump.",
 fr:[[40,10,40,16,40,32,46,24,47,34,44,44,44,56],[40,10,40,16,40,32,52,18,58,10,48,44,52,56],[40,10,40,16,40,32,50,12,48,3,52,44,58,56]]},
pushups:{nm:"push-ups",part:1,med:[10,20],
 d:"Hands under your shoulders, body in one straight line from head to heels. Lower your chest toward the floor, then press back up.",
 cues:["Body stays in a straight line, hips not sagging","Elbows about 45 degrees from your body","Lower with control","Neck relaxed, eyes on the floor"],
 easier:"Do them on your knees or with hands on a raised surface such as a table.",
 fr:[[14,26,18,29,45,38,18,42,18,54,60,46,72,54],[14,35,18,38,45,43,26,46,18,54,60,48,72,54],[14,44,18,46,45,48,28,50,18,54,60,51,72,54]]},
situps:{nm:"sit-ups",part:2,med:[10,20],
 d:"Lie on your back with knees bent and feet flat. Curl your upper body up toward your knees, then lower back down with control.",
 cues:["Do not pull on your neck","Exhale as you rise","Lower slowly instead of dropping","Keep feet on the floor"],
 easier:"Crunches: lift only your shoulders off the floor.",
 fr:[[10,50,15,51,40,52,22,48,16,48,52,40,60,52],[18,35,22,40,40,52,30,40,36,40,52,40,60,52],[30,22,32,28,40,52,40,34,46,38,52,40,60,52]]},
leg_raises:{nm:"leg raises",part:2,med:[8,14],
 d:"Lie on your back with legs straight. Raise your legs until they point to the ceiling, then lower them slowly without touching the floor.",
 cues:["Press your lower back gently into the floor","Move slowly, no swinging","Keep legs as straight as is comfortable","Stop lowering where your back starts to arch"],
 easier:"Bend your knees while raising and lowering.",
 fr:[[10,50,15,51,40,52,24,52,32,52,54,52,68,52],[10,50,15,51,40,52,24,52,32,52,52,42,64,32],[10,50,15,51,40,52,24,52,32,52,40,38,40,24]]},
back_ext:{nm:"back extensions",part:3,med:[10,16],
 d:"Lie face down with arms stretched forward. Lift your chest and arms slightly off the floor, pause, then lower with control.",
 cues:["Lift only a little, no need to arch hard","Look at the floor to keep your neck long","Squeeze your upper back","Move slowly"],
 easier:"Keep your arms by your sides and lift only your chest a few centimetres.",
 fr:[[62,50,54,52,38,53,62,54,74,54,24,54,8,54],[62,42,54,46,38,53,62,48,72,46,24,54,8,54],[62,35,54,40,38,53,63,40,72,38,24,52,8,52]]},
glute_bridge:{nm:"glute bridges",part:0,med:[12,20],
 d:"Lie on your back with knees bent and feet flat. Press through your heels to lift your hips until your body forms a line from shoulders to knees, then lower slowly.",
 cues:["Push through your heels","Squeeze your glutes at the top","Do not arch your lower back","Lower with control"],
 easier:"Lift your hips only a few centimetres and hold for a moment.",
 fr:[[10,50,15,51,40,52,24,53,34,54,52,40,60,52],[10,50,15,51,40,46,24,53,34,54,52,39,60,52],[10,50,15,51,40,38,24,53,34,54,52,38,60,52]]},
calf_raises:{nm:"calf raises",part:0,med:[15,25],
 d:"Stand tall with feet hip-width apart. Rise onto the balls of your feet, pause, then lower your heels slowly.",
 cues:["Rise straight up, do not roll outward","Pause at the top","Lower slowly","Hold a wall if you need balance"],
 easier:"Hold a wall or chair with both hands.",
 fr:[[40,12,40,18,40,34,44,26,46,34,40,45,40,56],[40,9,40,15,40,31,44,23,46,31,40,42,40,53],[40,6,40,12,40,28,44,20,46,28,40,39,40,50]]},
wide_pushups:{nm:"wide push-ups",part:1,med:[8,16],
 d:"Like a push-up, but with hands placed wider than your shoulders. Lower your chest between your hands, then press back up.",
 cues:["Hands slightly wider than shoulders","Body in a straight line","Elbows point out and slightly back","Lower with control"],
 easier:"Do them on your knees or against a wall.",
 fr:PU},
diamond_pushups:{nm:"diamond push-ups",part:1,med:[6,12],
 d:"Place your hands close together under your chest, thumbs and index fingers nearly touching. Lower your chest toward your hands, then press up.",
 cues:["Elbows stay close to your ribs","Body in a straight line","Go only as low as you can control","Stop if your wrists or elbows hurt"],
 easier:"Do them on your knees, or use a normal push-up width.",
 fr:PU},
pike_pushups:{nm:"pike push-ups",part:1,med:[6,12],
 d:"Start with hips high and body in an upside-down V. Bend your elbows to lower your head toward the floor between your hands, then press back up.",
 cues:["Keep hips high","Head moves between your hands, not in front","Keep your back flat","Move slowly"],
 easier:"Raise your hands on a sturdy chair so the angle is gentler.",
 fr:[[23,41,28,36,46,18,27,45,26,54,55,36,64,54],[24,45,28,42,46,20,34,48,26,54,55,37,64,54],[24,50,28,48,46,22,36,52,26,54,55,38,64,54]]},
mountain_climbers:{nm:"mountain climbers",part:2,med:[20,30],
 d:"From a straight-arm plank, drive one knee toward your chest, then switch legs in a steady rhythm. Count each knee drive as one rep.",
 cues:["Shoulders over your wrists","Hips level, not bouncing up","Keep a pace you can control","Breathe steadily"],
 easier:"Slow it down, or put your hands on a raised surface.",
 fr:[[14,26,18,29,45,38,18,42,18,54,59,46,72,54,59,46,72,54],[14,26,18,29,45,38,18,42,18,54,32,44,40,54,59,46,72,54],[14,26,18,29,45,38,18,42,18,54,59,46,72,54,32,44,40,54]]},
flutter_kicks:{nm:"flutter kicks",part:2,med:[16,30],
 d:"Lie on your back with legs straight and low. Alternate small up-and-down kicks. Count each kick as one rep.",
 cues:["Press your lower back into the floor","Small, controlled kicks","Keep legs as straight as is comfortable","Raise your legs higher if your back starts to arch"],
 easier:"Bend your knees slightly, or keep your feet higher off the floor.",
 fr:[[10,50,15,51,40,52,24,52,32,52,54,48,68,44,54,52,68,52],[10,50,15,51,40,52,24,52,32,52,54,50,68,48,54,50,68,48],[10,50,15,51,40,52,24,52,32,52,54,52,68,52,54,48,68,44]]},
bird_dog:{nm:"bird dogs",part:3,med:[8,14],
 d:"On hands and knees, reach one arm forward and the opposite leg back until they are level with your body. Return and switch sides. Count each reach as one rep.",
 cues:["Keep your hips and shoulders level","Move slowly, no swinging","Neck long, eyes on the floor","Do not arch your lower back"],
 easier:"Lift only the arm or only the leg at first.",
 fr:[[63,30,56,34,30,34,57,44,58,54,30,54,14,54],[63,30,56,34,30,34,66,38,75,34,19,36,8,40],[63,30,56,34,30,34,67,34,77,33,18,34,6,34]]},
good_morning:{nm:"good mornings",part:3,med:[12,20],
 d:"Stand with hands behind your head and knees slightly bent. Push your hips back and tip forward with a flat back, then stand up by driving your hips forward.",
 cues:["Hinge at the hips, not the waist","Back stays flat","Knees slightly bent","Go only as far as you can keep a flat back"],
 easier:"Keep your hands on your hips and tip forward only a little.",
 fr:[[40,10,40,16,40,32,35,13,40,8,40,44,40,56],[57,17,52,22,36,32,48,16,54,12,37,44,38,56],[55,26,50,28,34,32,46,22,52,23,36,44,38,56]]}
};
const EXIDS=Object.keys(EX);
const exOf=part=>EXIDS.filter(k=>EX[k].part===part);

// Draw one frame. Joints: 0 head, 1 neck, 2 pelvis, 3 elbow, 4 wrist, 5 knee, 6 foot, 7 knee2, 8 foot2.
function figSvg(f,mirror){
  const P=[];for(let i=0;i<f.length;i+=2)P.push([f[i],f[i+1]]);
  const q=a=>a[0]+" "+a[1],mx=a=>[2*P[2][0]-a[0],a[1]];
  let d="M"+q(P[1])+"L"+q(P[2])+"M"+q(P[1])+"L"+q(P[3])+"L"+q(P[4])+"M"+q(P[2])+"L"+q(P[5])+"L"+q(P[6]);
  if(P[7])d+="M"+q(P[2])+"L"+q(P[7])+"L"+q(P[8]);
  if(mirror)d+="M"+q(P[1])+"L"+q(mx(P[3]))+"L"+q(mx(P[4]))+"M"+q(P[2])+"L"+q(mx(P[5]))+"L"+q(mx(P[6]));
  return `<svg viewBox="0 0 80 60" role="img" aria-label="Movement frame"><path d="M2 56H78" class="fl"/><path d="${d}" class="ln"/><circle cx="${P[0][0]}" cy="${P[0][1]}" r="4" class="hd"/></svg>`;
}
const exInfoBtn=ids=>`<button class="ib" aria-label="Exercise info" onclick="showEx('${ids}')">i</button>`;
function exCard(id){
  const x=EX[id],lab=["Start","Middle","End"];
  return `<div class="exc"><h2>${x.nm[0].toUpperCase()+x.nm.slice(1)}</h2><div class="exf">${x.fr.map((f,i)=>`<figure>${figSvg(f,x.mirror)}<figcaption class="mu">${lab[i]}</figcaption></figure>`).join("")}</div><p>${x.d}</p><div class="mu">Form cues</div><ul>${x.cues.map(c=>`<li>${c}</li>`).join("")}</ul><div class="mu">Easier variation</div><p>${x.easier}</p></div>`;
}
function showEx(ids){
  $("exb").innerHTML=ids.split(",").map(exCard).join("")+`<p class="mu">Stop if anything hurts. Move within what is comfortable for your body.</p>`;
  $("ex").classList.add("on");$("exx").focus();
}
const hideEx=()=>$("ex").classList.remove("on");
