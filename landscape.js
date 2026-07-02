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

// CSS 控制提示显示/隐藏——比 JS 可靠
var style=document.createElement("style");
style.textContent='#landscape-hint{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0d0a06;font-family:Noto Serif SC,serif}@keyframes rhSpin{0%,100%{transform:rotate(0deg)}50%{transform:rotate(90deg)}}@media(orientation:landscape){#landscape-hint{display:none!important}}';
document.head.appendChild(style);

// 创建提示
var hint=document.createElement("div");
hint.id="landscape-hint";
hint.innerHTML='<div style="font-size:56px;margin-bottom:20px;animation:rhSpin 2s ease-in-out infinite">\u{1F4F1}</div><div style="font-size:20px;color:#C4A46C;text-align:center;line-height:2.4">\u8bf7\u65cb\u8f6c\u624b\u673a\u6a2a\u5c4f\u89c2\u770b<br><span style="font-size:14px;color:#8B7355">Please rotate your phone</span></div>';
document.addEventListener("DOMContentLoaded",function(){
  if(!hintWasDismissed()&&!window.__noForceLandscape)document.body.appendChild(hint);
  // CSS 自动根据横竖屏显隐，JS 只负责记住状态
});

// 一旦横屏就记住
var mq=window.matchMedia("(orientation: landscape)");
function onLandscape(e){if(e.matches){markDismissed();if(hint.parentNode)hint.parentNode.removeChild(hint)}}
if(mq.addEventListener){mq.addEventListener("change",onLandscape)}else{mq.addListener(onLandscape)}
if(mq.matches)markDismissed();
})();