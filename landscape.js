(function(){
function isLandscape(){
  if(window.matchMedia&&window.matchMedia("(orientation: landscape)").matches)return true;
  if(window.matchMedia&&window.matchMedia("(orientation: portrait)").matches)return false;
  if(screen.orientation&&screen.orientation.type)return screen.orientation.type.startsWith("landscape");
  var sw=screen.width,sh=screen.height;
  if(typeof sw==="number"&&typeof sh==="number"&&sw>0&&sh>0)return sw>sh;
  return window.innerWidth>window.innerHeight;
}

// 三重存储：localStorage + sessionStorage + cookie，确保跨页面记住状态
var KEY = "gobi_hint_off";
function hintWasDismissed(){
  try{ if(localStorage.getItem(KEY)==="1")return true }catch(e){}
  try{ if(sessionStorage.getItem(KEY)==="1")return true }catch(e){}
  try{ if(document.cookie.indexOf(KEY+"=1")>=0)return true }catch(e){}
  return false;
}
function markHintDismissed(){
  try{ localStorage.setItem(KEY,"1") }catch(e){}
  try{ sessionStorage.setItem(KEY,"1") }catch(e){}
  try{ document.cookie=KEY+"=1;path=/;max-age=86400" }catch(e){}
}

var hintDismissed = hintWasDismissed();
var hintEl = null, styleInjected = false;

function injectStyles(){
  if(styleInjected)return;
  styleInjected=true;
  var s=document.createElement("style");
  s.textContent="@keyframes rhSpin3{0%,100%{transform:rotate(0deg)}50%{transform:rotate(90deg)}}";
  document.head.appendChild(s);
}

function buildHint(){
  if(hintEl)return hintEl;
  injectStyles();
  hintEl=document.createElement("div");
  hintEl.id="landscape-hint";
  hintEl.style.cssText="position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:#0d0a06;pointer-events:auto;font-family:Noto Serif SC,serif";
  hintEl.innerHTML='<div style="font-size:56px;margin-bottom:20px;animation:rhSpin3 2s ease-in-out infinite">\u{1F4F1}</div><div style="font-size:20px;color:#C4A46C;text-align:center;line-height:2.4">\u8bf7\u65cb\u8f6c\u624b\u673a\u6a2a\u5c4f\u89c2\u770b<br><span style="font-size:14px;color:#8B7355">Please rotate your phone</span></div>';
  document.body.appendChild(hintEl);
  return hintEl;
}

function showHint(){
  if(hintDismissed||window.__noForceLandscape)return;
  buildHint().style.display="flex";
}

function hideHint(){
  if(hintEl)hintEl.style.display="none";
}

function checkOrientation(){
  if(window.innerWidth<100)return; // 页面还没准备好
  if(isLandscape()){
    hintDismissed=true;
    markHintDismissed();
    hideHint();
  }else{
    if(!hintDismissed&&!window.__noForceLandscape)showHint();
  }
}

function delayedCheck(){
  checkOrientation();
  setTimeout(checkOrientation,500);
  setTimeout(checkOrientation,1200);
}

window.addEventListener("resize",function(){checkOrientation()});
window.addEventListener("orientationchange",function(){delayedCheck()});

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",delayedCheck);
}else{
  delayedCheck();
}
})();