(function(){
function checkOrientation(){
  var landscape=window.innerWidth>window.innerHeight&&window.innerWidth>100;
  var app=document.getElementById("app");
  if(!app)return;
  if(landscape){
    app.className="landscape-mode";
  }else{
    app.className="portrait-mode";
  }
}
window.addEventListener("resize",checkOrientation);
if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",checkOrientation);
}else{
  checkOrientation();
}
})();
