(function(){
var KEY="gobi_hint_off";
function hintWasDismissed(){
  try{if(localStorage.getItem(KEY)==="1")return true}catch(e){}
  try{if(sessionStorage.getItem(KEY)==="1")return true}catch(e){}
  try{if(document.cookie.indexOf(KEY+"=1")>=0)return true}catch(e){}
  return false;
}
function markDismissed(){
  try{localStorage.setItem(KEY,"1")}catch(e){}
  try{sessionStorage.setItem(KEY,"1")}catch(e){}
  try{document.cookie=KEY+"=1;path=/;max-age=86400"}catch(e){}
}
// 已横屏过：直接移除提示DOM
if(hintWasDismissed()||window.__noForceLandscape){
  var removeHint=function(){var h=document.getElementById("landscape-hint");if(h)h.parentNode.removeChild(h)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",removeHint);
  else removeHint();
}
// 横屏即记住
var mq=window.matchMedia("(orientation: landscape)");
function onLandscape(e){if(e.matches){markDismissed();var h=document.getElementById("landscape-hint");if(h)h.parentNode.removeChild(h)}}
if(mq.addEventListener)mq.addEventListener("change",onLandscape);
else mq.addListener(onLandscape);
if(mq.matches){markDismissed();var h=document.getElementById("landscape-hint");if(h)h.parentNode.removeChild(h)}
})();