(function(){
function isLandscape(){
  if(window.matchMedia&&window.matchMedia("(orientation: landscape)").matches)return true;
  if(window.matchMedia&&window.matchMedia("(orientation: portrait)").matches)return false;
  if(screen.orientation&&screen.orientation.type)return screen.orientation.type.startsWith("landscape");
  var sw=screen.width,sh=screen.height;
  if(typeof sw==="number"&&typeof sh==="number"&&sw>0&&sh>0)return sw>sh;
  return window.innerWidth>window.innerHeight;
}

// 有 canvas 的页面不旋转 body（会扭曲画布），只提示
function hasCanvas(){return !!document.querySelector("canvas")}

var hintDismissed=false, forceActive=false, hintTimer=null;
var hintEl=null;

function buildHint(){
  if(hintEl)return hintEl;
  var s=document.createElement("style");
  s.textContent="@keyframes rhSpin3{0%,100%{transform:rotate(0deg)}50%{transform:rotate(90deg)}}";
  document.head.appendChild(s);
  var fs=document.createElement("style");
  fs.id="force-landscape-style";
  fs.textContent="body.force-landscape{position:fixed!important;top:0!important;left:100vw!important;width:100vh!important;height:100vw!important;transform:rotate(90deg)!important;transform-origin:0 0!important;margin:0!important;overflow:hidden!important}";
  document.head.appendChild(fs);
  hintEl=document.createElement("div");
  hintEl.id="landscape-hint";
  hintEl.style.cssText="position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.92);transition:opacity 0.4s;pointer-events:auto;font-family:Noto Serif SC,serif";
  var hasCv=hasCanvas();
  hintEl.innerHTML='<div style="font-size:50px;margin-bottom:16px;animation:rhSpin3 2s ease-in-out infinite">\u{1F4F1}</div><div style="font-size:18px;color:#C4A46C;text-align:center;line-height:2.2">'+(hasCv?'\u8bf7\u65cb\u8f6c\u624b\u673a\u6a2a\u5c4f\u89c2\u770b':'\u6b63\u5728\u8f6c\u4e3a\u6a2a\u5c4f\u6a21\u5f0f')+'<br><span style="font-size:13px;color:#8B7355">'+(hasCv?'\u8bf7\u624b\u52a8\u65cb\u8f6c\u8bbe\u5907':'\u8bf7\u7a0d\u5019...')+'</span></div><div id="landscape-skip" style="margin-top:28px;padding:10px 30px;border:1px solid rgba(200,170,100,0.35);border-radius:20px;color:rgba(200,170,100,0.5);font-size:13px;cursor:pointer;transition:all 0.3s;opacity:0">\u4fdd\u6301\u7ad6\u5c4f</div>';
  document.body.appendChild(hintEl);
  var skip=hintEl.querySelector("#landscape-skip");
  skip.addEventListener("click",function(e){e.stopPropagation();skipForce()});
  return hintEl;
}

function showHint(){
  if(hintDismissed||forceActive)return;
  var el=buildHint();
  el.style.display="flex";el.style.opacity="1";
  var skip=el.querySelector("#landscape-skip");
  if(skip)skip.style.opacity="0";
  // 2秒后显示"保持竖屏"按钮
  hintTimer=setTimeout(function(){
    if(!hintDismissed&&!forceActive&&skip)skip.style.opacity="1";
  },2000);
  // 有canvas的页面不自动强横，只提示
  if(hasCanvas()||window.__noForceLandscape)return;
  // 3.5秒后自动强横
  hintTimer=setTimeout(function(){
    if(!hintDismissed)applyForce();
  },3500);
}

function applyForce(){
  if(forceActive||hintDismissed||hasCanvas()||window.__noForceLandscape)return;
  forceActive=true;
  clearTimeout(hintTimer);
  var el=buildHint();
  el.style.opacity="0";
  setTimeout(function(){el.style.display="none"},400);
  document.body.classList.add("force-landscape");
  if(typeof window.onForceLandscape==="function")window.onForceLandscape();
  setTimeout(function(){window.dispatchEvent(new Event("resize"))},100);
  setTimeout(function(){window.dispatchEvent(new Event("resize"))},500);
}

function removeForce(){
  if(!forceActive)return;
  forceActive=false;
  document.body.classList.remove("force-landscape");
  if(typeof window.onForceLandscapeEnd==="function")window.onForceLandscapeEnd();
  setTimeout(function(){window.dispatchEvent(new Event("resize"))},100);
}

function skipForce(){
  hintDismissed=true;forceActive=false;
  clearTimeout(hintTimer);
  var el=buildHint();
  el.style.opacity="0";
  document.body.classList.remove("force-landscape");
  setTimeout(function(){el.style.display="none"},400);
}

function checkOrientation(){
  var landscape=isLandscape()&&window.innerWidth>100;
  if(landscape){
    hintDismissed=false;removeForce();
    var el=buildHint();
    el.style.display="none";el.style.opacity="0";
  }else{
    if(hintDismissed||forceActive)return;
    showHint();
  }
}

window.requestLandscape=function(){
  var el=document.documentElement;
  if(el.requestFullscreen){
    el.requestFullscreen().then(function(){
      if(screen.orientation&&screen.orientation.lock)screen.orientation.lock("landscape").catch(function(){});
    }).catch(function(){});
  }else if(el.webkitRequestFullscreen){
    el.webkitRequestFullscreen();
  }
};

function delayedCheck(){
  checkOrientation();
  setTimeout(checkOrientation,300);
  setTimeout(checkOrientation,800);
}

window.addEventListener("resize",function(){
  if(forceActive)return;
  checkOrientation();
});
window.addEventListener("orientationchange",function(){
  hintDismissed=false;removeForce();delayedCheck();
});

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",delayedCheck);
}else{
  delayedCheck();
}
})();