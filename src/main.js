// Boot
S=loadSave();sgExpire();penalty();pendShow();tab("today");if(loadNote)toast(loadNote);
if(!S.tut)tutStart();
// Offline support for the hosted/installed app (http/https only; not in the dev or test pages).
if("serviceWorker" in navigator&&/^https?:/.test(location.protocol)&&!window.__SAVEKEY&&!window.__noFx)navigator.serviceWorker.register("sw.js").catch(()=>{});
