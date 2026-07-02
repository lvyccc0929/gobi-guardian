(function(){
function isLandscape(){
  if(window.matchMedia&&window.matchMedia("(orientation: landscape)").matches)return true;
  if(window.matchMedia&&window.matchMedia("(orientation: portrait)").matches)return false;
  if(screen.orientation&&screen.orientation.type)return screen.orientation.type.startsWith("landscape");
  var sw=screen.width,sh=screen.height;
  if(typeof sw==="number"&&typeof sh==="number"&&sw>0&&sh>0)return sw>sh;
  return window.innerWidth>window.innerHeight;
}

function hasCanvas(){return !!document.querySelector("canvas")}

var hintDismissed=false, hintEl=null, hintTimer=null;
var styleInjected=false;

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
  hintEl.style.cssText="position:fixed;inset:0;z-index:99999;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.92);transition:opacity 0.4s;pointer-events:auto;font-family:Noto Serif SC,serif";
  hintEl.innerHTML='<div style="font-size:50px;margin-bottom:16px;animation:rhSpin3 2s ease-in-out infinite">\u{1F4F1}</div><div style="font-size:18px;color:#C4A46C;text-align:center;line-height:2.2">\u8bf7\u65cb\u8f6c\u624b\u673a\u6a2a\u5c4f\u89c2\u770b<br><span style="font-size:13px;color:#8B7355">\u83b7\u5f97\u6700\u4f73\u4f53\u9a8c</span></div><div id="landscape-skip" style="margin-top:28px;padding:10px 30px;border:1px solid rgba(200,170,100,0.35);border-radius:20px;color:rgba(200,170,100,0.5);font-size:13px;cursor:pointer;transition:all 0.3s;opacity:0">\u7ee7\u7eed\u7ad6\u5c4f\u6d4f\u89c8</div>';
  document.body.appendChild(hintEl);
  var skip=hintEl.querySelector("#landscape-skip");
  skip.addEventListener("click",function(e){e.stopPropagation();dismissHint()});
  return hintEl;
}

function showHint(){
  if(hintDismissed||window.__noForceLandscape)return;
  var el=buildHint();
  clearTimeout(hintTimer);
  el.style.display="flex";el.style.opacity="1";
  var skip=el.querySelector("#landscape-skip");
  if(skip)skip.style.opacity="0";
  // 2.5秒后显示跳过按钮
  hintTimer=setTimeout(function(){
    if(!hintDismissed&&skip)skip.style.opacity="1";
  },2500);
}

function dismissHint(){
  hintDismissed=true;
  clearTimeout(hintTimer);
  var el=buildHint();
  el.style.opacity="0";
  setTimeout(function(){el.style.display="none"},400);
}

function checkOrientation(){
  var landscape=isLandscape()&&window.innerWidth>100;
  if(landscape){
    // 横屏：隐藏提示，重置状态
    hintDismissed=false;
    clearTimeout(hintTimer);
    var el=buildHint();
    el.style.opacity="0";
    setTimeout(function(){el.style.display="none"},300);
  }else{
    // 竖屏：显示提示（除非已跳过）
    if(!hintDismissed&&!window.__noForceLandscape)showHint();
  }
}

function delayedCheck(){
  checkOrientation();
  setTimeout(checkOrientation,300);
  setTimeout(checkOrientation,800);
}

window.addEventListener("resize",function(){checkOrientation()});
window.addEventListener("orientationchange",function(){
  // 物理旋转：重置跳过状态，重新判断
  hintDismissed=false;
  delayedCheck();
});

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",delayedCheck);
}else{
  delayedCheck();
}
})();