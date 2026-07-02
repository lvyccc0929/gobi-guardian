(function () {
  var s = document.createElement("style");
  s.id = "lh-s";
  document.head.appendChild(s);

  function update() {
    var portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
    if (!window.__LH) window.__LH = {};
    window.__LH.active = portrait;

    if (portrait) {
      // 竖屏手机：html 宽=屏幕高，高=屏幕宽，然后整体左移到可视区域
      s.textContent =
        "html{position:fixed;top:0;left:0;width:" + window.innerHeight + "px;height:" + window.innerWidth + "px;" +
        "transform-origin:0 0;transform:rotate(90deg);overflow:hidden}" +
        "body{width:100%;height:100%;overflow:hidden;position:static}";
      window.__LH.getWidth = function () { return window.innerHeight; };
      window.__LH.getHeight = function () { return window.innerWidth; };
    } else {
      s.textContent =
        "html{position:static;width:100%;height:100%;left:auto;top:auto;transform:none;overflow:hidden}" +
        "body{width:100%;height:100%;overflow:hidden;position:static;transform:none}";
      window.__LH.getWidth = function () { return window.innerWidth; };
      window.__LH.getHeight = function () { return window.innerHeight; };
    }
  }

  update();
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", function () {
    setTimeout(update, 300);
  });
})();
