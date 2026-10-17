// Export / import of the save.
function expJ(){$("jx").value=JSON.stringify(S);$("jx").select();try{navigator.clipboard.writeText($("jx").value)}catch(e){}toast("Data copied.")}
function impJ(){try{const n=parseSave($("jx").value);keepPrev();S=n;raiseFloor();save();render();toast("Data imported.")}catch(e){toast("Import failed: "+(e.message||"invalid data")+". Current progress kept.")}}
