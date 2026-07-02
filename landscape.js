(function () {
  var styleEl = document.createElement("style");
  styleEl.id = "landscape-force";
  styleEl.textContent =
    "@media screen and (orientation: portrait) and (max-width: 900px) {" +
    "  html, body {" +
    "    width: 100vh;" +
    "    height: 100vw;" +
    "  }" +
    "  body {" +
    "    transform: rotate(-90deg);" +
    "    transform-origin: left top;" +
    "    position: absolute;" +
    "    top: 100%;" +
    "    left: 0;" +
    "    overflow: hidden;" +
    "  }" +
    "}";
  document.head.appendChild(styleEl);
})();
