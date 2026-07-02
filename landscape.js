(function () {
  var s = document.createElement("style");
  s.id = "lh-s";
  document.head.appendChild(s);

  function update() {
    var portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
    if (!window.__LH) window.__LH = {};
    window.__LH.active = portrait;

    if (portrait) {
      // 关键：用具体像素值，left:0, top:0, 从原点旋转
      s.textContent =
        "@media screen and (orientation: portrait) {" +
        "html{position:fixed;top:0;left:0;width:" + window.innerHeight + "px;height:" + window.innerWidth + "px;" +
        "transform:rotate(90deg);transform-origin:top left;overflow:hidden!important}" +
        "body{width:" + window.innerHeight + "px;height:" + window.innerWidth + "px;" +
        "overflow:hidden!important;position:relative;transform:none!important;margin:0;padding:0}" +
        "}";
      window.__LH.getWidth = function () { return window.innerHeight; };
      window.__LH.getHeight = function () { return window.innerWidth; };
    } else {
      s.textContent =
        "html{position:static;width:100%;height:100%;transform:none;left:auto;top:auto;overflow:hidden}" +
        "body{width:100%;height:100%;overflow:hidden;position:static;transform:none}";
      window.__LH.getWidth = function () { return window.innerWidth; };
      window.__LH.getHeight = function () { return window.innerHeight; };
    }
  }

  update();
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", function () { setTimeout(update, 500); });
})();
