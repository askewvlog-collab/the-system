// Setup tab helpers: daily window, reminder, test tools.
function ics(){
  const[s]=S.win.s.split(":").map(Number),m=+S.win.s.split(":")[1];let t=s*60+m-30;if(t<0)t+=1440;
  const hh=String(Math.floor(t/60)).padStart(2,"0"),mm=String(t%60).padStart(2,"0");
  return["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//gate//EN","BEGIN:VEVENT","UID:gate-daily@local","DTSTART:20260101T"+hh+mm+"00","DURATION:PT30M","RRULE:FREQ=DAILY","SUMMARY:The gate opens in 30 minutes","DESCRIPTION:Your daily quest is waiting. The window is "+S.win.s+" to "+endT()+".","BEGIN:VALARM","TRIGGER:PT0M","ACTION:DISPLAY","DESCRIPTION:The gate opens soon","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
}
function remind(v){S.rem=v;if(v){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([ics()],{type:"text/calendar"}));a.download="reminder.ics";a.click()}catch(e){}}save();render()}
function endT(){const[h,m]=S.win.s.split(":").map(Number),t=(h*60+m+60*(S.win.len||2))%1440;return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0")}
function setHM(h12,m,pm){const h=h12%12+(pm?12:0);S.win.s=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");save();render()}
function setH(v){const[h,m]=S.win.s.split(":").map(Number);setHM(+v,m,h>=12)}
function setM(v){const[h]=S.win.s.split(":").map(Number);setHM(h%12||12,+v,h>=12)}
function setP(v){const[h,m]=S.win.s.split(":").map(Number);setHM(h%12||12,m,+v==1)}
function setLen(n){S.win.len=n;save();render()}
function tp2(){const[h,m]=S.win.s.split(":").map(Number),h12=h%12||12;const sel=(opts,cur,fn)=>`<select class="sl" onchange="${fn}(this.value)">${opts.map(o=>`<option value="${o[0]}" ${o[0]==cur?"selected":""}>${o[1]}</option>`).join("")}</select>`;return `<div class="tp"><div class="mu">Opens at <b style="color:#fff;font-size:18px">${S.win.s}</b></div><div class="row" style="justify-content:flex-start;margin-top:6px">${sel([...Array(12).keys()].map(i=>[i+1,i+1]),h12,"setH")}${sel([...Array(12).keys()].map(i=>[i*5,String(i*5).padStart(2,"0")]),m,"setM")}${sel([[0,"AM"],[1,"PM"]],h>=12?1:0,"setP")}</div></div>`}
