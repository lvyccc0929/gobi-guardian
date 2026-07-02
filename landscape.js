(function () {
  var s = document.createElement("style");
  s.id = "lh-s";
  document.head.appendChild(s);

  function update() {
    var portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
    if (!window.__LH) window.__LH = {};
    window.__LH.active = portrait;

    if (portrait) {
      // 竖屏手机：html 宽=屏幕高，高=屏幕宽，从左上角顺时针转90度
      s.textContent =
        "html{position:fixed;top:0;left:0;width:" + window.innerHeight + "px;height:" + window.innerWidth + "px;" +
        "transform:rotate(90deg);transform-origin:top left;overflow:hidden}" +
        "body{width:" + window.innerHeight + "px;height:" + window.innerWidth + "px;" +
        "overflow:hidden;margin:0;padding:0}";
      window.__LH.getWidth = function () { return window.innerHeight; };
      window.__LH.getHeight = function () { return window.innerWidth; };
    } else {
      s.textContent = "";
      window.__LH.getWidth = function () { return window.innerWidth; };
      window.__LH.getHeight = function () { return window.innerHeight; };
    }
  }

  // 延迟执行确保在页面其他脚本之前
  setTimeout(update, 50);
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", function () { setTimeout(update, 500); });
})();
