document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("scheme-toggle");
  if (!toggle) return;

  var container = document.documentElement;
  var stored = localStorage.getItem("scheme");
  var preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var scheme = stored || (preferredDark ? "dark" : "light");

  function applyScheme(nextScheme) {
    if (!window.feather || !window.feather.icons) {
      return;
    }

    if (nextScheme === "dark") {
      localStorage.setItem("scheme", "dark");
      toggle.innerHTML = window.feather.icons.sun.toSvg();
      toggle.classList.remove("light");
      toggle.classList.add("dark");
      container.classList.add("dark");
      container.classList.remove("light");
    } else {
      localStorage.setItem("scheme", "light");
      toggle.innerHTML = window.feather.icons.moon.toSvg();
      toggle.classList.remove("dark");
      toggle.classList.add("light");
      container.classList.remove("dark");
      container.classList.add("light");
    }
  }

  applyScheme(scheme);

  toggle.addEventListener("click", function (event) {
    event.preventDefault();
    applyScheme(toggle.classList.contains("dark") ? "light" : "dark");
  });
});
