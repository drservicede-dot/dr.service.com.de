(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  // Ensure aria basics
  const NAV_ID = nav.id || "site-nav";
  nav.id = NAV_ID;
  toggle.setAttribute("aria-controls", NAV_ID);

  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    nav.dataset.open = open ? "true" : "false";

    // Desktop: always visible, so don't force inline styles
    if (!isMobile()) {
      nav.style.display = "";
      nav.style.position = "";
      nav.style.top = "";
      nav.style.left = "";
      nav.style.right = "";
      nav.style.zIndex = "";
      nav.style.flexDirection = "";
      nav.style.gap = "";
      nav.style.padding = "";
      nav.style.borderRadius = "";
      nav.style.border = "";
      nav.style.background = "";
      nav.style.boxShadow = "";
      return;
    }

    if (open) {
      // Mobile: open as dropdown panel (works even without special CSS)
      const rect = header ? header.getBoundingClientRect() : { height: 64 };
      nav.style.display = "flex";
      nav.style.flexDirection = "column";
      nav.style.gap = "10px";

      nav.style.position = "absolute";
      nav.style.top = `${Math.max(56, Math.round(rect.height))}px`;
      nav.style.left = "12px";
      nav.style.right = "12px";
      nav.style.zIndex = "9999";

      nav.style.padding = "12px";
      nav.style.borderRadius = "18px";
      nav.style.border = "1px solid rgba(0,0,0,.10)";
      nav.style.background = "#fff";
      nav.style.boxShadow = "0 18px 40px rgba(0,0,0,.18)";
    } else {
      // Mobile: close
      nav.style.display = "none";
    }
  };

  const getOpen = () => nav.dataset.open === "true";

  // Init: on mobile start closed, on desktop do nothing
  const init = () => {
    if (isMobile()) {
      setOpen(false);
    } else {
      // keep desktop as normal (no inline forcing)
      setOpen(false); // sets aria only, clears styles
    }
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    setOpen(!getOpen());
  });

  // Close when clicking outside (mobile only)
  document.addEventListener("click", (e) => {
    if (!isMobile()) return;
    if (!getOpen()) return;

    const target = e.target;
    const clickedToggle = toggle.contains(target);
    const clickedNav = nav.contains(target);

    if (!clickedToggle && !clickedNav) setOpen(false);
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!isMobile()) return;
    if (getOpen()) setOpen(false);
  });

  // Close after clicking a nav link (mobile)
  nav.addEventListener("click", (e) => {
    if (!isMobile()) return;
    const a = e.target.closest("a");
    if (a) setOpen(false);
  });

  // Handle resize/orientation changes
  window.addEventListener("resize", () => {
    // If switching between mobile/desktop, re-init
    init();
  });

  init();
})();
