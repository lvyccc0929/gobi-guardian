(function () {
  var s = document.createElement("style");
  s.id = "lh-s";
  document.head.appendChild(s);

  function update() {
    var portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
    if (!window.__LH) window.__LH = {};
    window.__LH.active = portrait;
    window.__LH.getWidth = function () {
      return portrait ? (document.documentElement.clientWidth || window.innerWidth) : window.innerWidth;
    };
    window.__LH.getHeight = function () {
      return portrait ? (document.documentElement.clientHeight || window.innerHeight) : window.innerHeight;
    };

    if (portrait) {
      s.textContent = [
        "html{position:fixed;top:0;left:0;width:100vh;height:100vw;",
        "transform:rotate(90deg);transform-origin:0 0;margin-left:100vw;overflow:hidden}",
        "body{width:100%;height:100%;overflow:hidden;position:static;transform:none}"
      ].join("");
    } else {
      s.textContent = "html{position:static;width:100%;height:100%;transform:none;margin-left:0;overflow:hidden}body{width:100%;height:100%;overflow:hidden;position:static;transform:none}";
    }
  }

  update();
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", update);
})();
