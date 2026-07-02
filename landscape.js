(function () {
  var s = document.createElement("style");
  s.id = "lh-s";
  document.head.appendChild(s);

  function update() {
    // 不做任何旋转，保持原样，只提供尺寸查询
    window.__LH = { active: false };
    window.__LH.getWidth = function () { return window.innerWidth; };
    window.__LH.getHeight = function () { return window.innerHeight; };
    s.textContent = "";
  }

  update();
  window.addEventListener("resize", update);
})();
