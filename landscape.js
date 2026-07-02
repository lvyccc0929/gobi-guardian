(function(){
var portrait=window.innerHeight>window.innerWidth&&window.innerWidth<900;
if(!window.__LH)window.__LH={};
window.__LH.active=portrait;
window.__LH.getWidth=function(){return portrait?window.innerHeight:window.innerWidth};
window.__LH.getHeight=function(){return portrait?window.innerWidth:window.innerHeight};
if(portrait){
  var w=window.innerHeight,h=window.innerWidth;
  document.documentElement.style.cssText="position:fixed;top:0;left:0;width:"+w+"px;height:"+h+"px;transform:rotate(90deg);transform-origin:top left;overflow:hidden";
  document.body.style.cssText="width:"+w+"px;height:"+h+"px;overflow:hidden;margin:0;padding:0";
}
window.addEventListener("resize",function(){location.reload()});
window.addEventListener("orientationchange",function(){setTimeout(function(){location.reload()},500)});
})();
