(function () {
  var s = document.createElement("style");
  s.id = "lh-s";
  document.head.appendChild(s);

  function update() {
    var portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
    if (!window.__LH) window.__LH = {};
    window.__LH.active = portrait;
    window.__LH.getWidth = function () {
      return portrait ? document.documentElement.clientWidth : window.innerWidth;
    };
    window.__LH.getHeight = function () {
      return portrait ? document.documentElement.clientHeight : window.innerHeight;
    };

    if (portrait) {
      s.textContent =
        "html{position:fixed;top:0;left:100%;width:100vh;height:100vw;" +
        "transform:rotate(90deg);transform-origin:top left;overflow:hidden}" +
        "body{width:100%;height:100%;overflow:hidden;position:static;transform:none}";
    } else {
      s.textContent =
        "html{position:static;width:100%;height:100%;left:auto;transform:none;overflow:hidden}" +
        "body{width:100%;height:100%;overflow:hidden;position:static;transform:none}";
    }
  }

  update();
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", update);
})();
