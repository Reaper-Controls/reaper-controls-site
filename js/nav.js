// Reaper Controls: About dropdown in the main nav.
// Opens on hover (desktop, via CSS) and on click/tap (via this script);
// closes on outside click or Escape.
(function () {
  var drops = document.querySelectorAll(".nav-drop");
  drops.forEach(function (d) {
    var btn = d.querySelector(".nav-drop-btn");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
    });
  });
  // Mobile: hamburger toggles the whole menu panel
  var masthead = document.querySelector(".masthead");
  var toggle = document.querySelector(".nav-toggle");
  function setMenu(open) {
    if (!masthead || !toggle) return;
    masthead.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
  }
  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!masthead.classList.contains("nav-open"));
    });
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) setMenu(false);
  });

  function closeAll() {
    drops.forEach(function (d) {
      var b = d.querySelector(".nav-drop-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-drop")) closeAll();
    if (!e.target.closest(".masthead")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAll(); setMenu(false); }
  });
})();
