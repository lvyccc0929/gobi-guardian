(function(){
function isLandscape(){
  var w=window.innerWidth,h=window.innerHeight;
  var sw=screen.width,sh=screen.height;
  // 最可靠：实际宽高比
  if(w>h&&w>300)return true;
  // screen 兜底
  if(sw>0&&sh>0&&sw>sh&&w>200)return true;
  // matchMedia
  if(window.matchMedia){
    if(window.matchMedia("(orientation: landscape)").matches)return true;
  }
  // screen.orientation API
  if(screen.orientation&&screen.orientation.type&&screen.orientation.type.startsWith("landscape"))return true;
  return false;
}

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
var hintEl = null, pollTimer = null, styleInjected = false;

function injectStyles(){
  if(styleInjected)return;
  styleInjected=true;
  var s=document.createElement("style");
  s.textContent="@keyframes rhSpin{0%,100%{transform:rotate(0deg)}50%{transform:rotate(90deg)}}";
  document.head.appendChild(s);
}

function buildHint(){
  if(hintEl)return hintEl;
  injectStyles();
  hintEl=document.createElement("div");
  hintEl.id="landscape-hint";
  hintEl.style.cssText="position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:#0d0a06;pointer-events:auto;font-family:Noto Serif SC,serif";
  hintEl.innerHTML='<div style="font-size:56px;margin-bottom:20px;animation:rhSpin 2s ease-in-out infinite">\u{1F4F1}</div><div style="font-size:20px;color:#C4A46C;text-align:center;line-height:2.4">\u8bf7\u65cb\u8f6c\u624b\u673a\u6a2a\u5c4f\u89c2\u770b<br><span style="font-size:14px;color:#8B7355">Please rotate your phone</span></div>';
  document.body.appendChild(hintEl);
  return hintEl;
}

function showHint(){buildHint().style.display="flex"}
function hideHint(){if(hintEl)hintEl.style.display="none"}

function checkOrientation(){
  if(hintDismissed||window.__noForceLandscape)return;
  if(isLandscape()){
    hintDismissed=true;
    markHintDismissed();
    hideHint();
    stopPolling();
  }else{
    showHint();
    startPolling();
  }
}

function startPolling(){
  if(pollTimer)return;
  pollTimer=setInterval(function(){
    if(hintDismissed){stopPolling();return}
    if(isLandscape()){
      hintDismissed=true;
      markHintDismissed();
      hideHint();
      stopPolling();
    }
  },500);
}
function stopPolling(){
  if(pollTimer){clearInterval(pollTimer);pollTimer=null}
}

window.addEventListener("resize",checkOrientation);
window.addEventListener("orientationchange",function(){setTimeout(checkOrientation,200)});
document.addEventListener("visibilitychange",function(){if(!document.hidden)checkOrientation()});

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",function(){setTimeout(checkOrientation,100)});
}else{
  setTimeout(checkOrientation,100);
}
})();