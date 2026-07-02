(function () {
  var styleEl = document.createElement("style");
  styleEl.id = "landscape-force";

  function isPortraitMobile() {
    return window.innerHeight > window.innerWidth && window.innerWidth < 900;
  }

  window.__LH = {
    active: false,
    getWidth: function () { return document.body.clientWidth || window.innerWidth; },
    getHeight: function () { return document.body.clientHeight || window.innerHeight; }
  };

  function applyStyle() {
    var active = isPortraitMobile();
    window.__LH.active = active;
    if (active) {
      styleEl.textContent =
        "html, body { width: 100vh; height: 100vw; }" +
        "body { transform: rotate(-90deg); transform-origin: left top; position: absolute; top: 100%; left: 0; overflow: hidden; }";
    } else {
      styleEl.textContent = "html, body { width: 100%; height: 100%; } body { transform: none; position: static; }";
    }
  }

  document.head.appendChild(styleEl);
  applyStyle();
  window.addEventListener("orientationchange", applyStyle);
  window.addEventListener("resize", applyStyle);
})();
