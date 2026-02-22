(() => {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-car-track]");
  const viewport = root.querySelector("[data-car-viewport]");
  const btnPrev = root.querySelector("[data-car-prev]");
  const btnNext = root.querySelector("[data-car-next]");
  const dotsWrap = root.querySelector("[data-car-dots]");

  if (!track || !viewport || !btnPrev || !btnNext || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll(".car-card"));
  if (cards.length === 0) return;

  // Helper: get scroll step (one card + gap)
  const getStep = () => {
    const first = cards[0];
    const cardW = first.getBoundingClientRect().width;
    // gap from computed style
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "12") || 12;
    return cardW + gap;
  };

  // Dots
  const dots = cards.map((_, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "car-dot";
    d.setAttribute("aria-label", `Slide ${i + 1}`);
    d.addEventListener("click", () => scrollToIndex(i));
    dotsWrap.appendChild(d);
    return d;
  });

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const getIndexByScroll = () => {
    const step = getStep();
    const idx = Math.round(track.scrollLeft / step);
    return clamp(idx, 0, cards.length - 1);
  };

  const setActiveDot = (idx) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  };

  const scrollToIndex = (idx) => {
    const step = getStep();
    track.scrollTo({ left: idx * step, behavior: "smooth" });
    setActiveDot(idx);
  };

  const scrollByDir = (dir) => {
    const step = getStep();
    const idx = getIndexByScroll();
    const next = clamp(idx + dir, 0, cards.length - 1);
    scrollToIndex(next);
  };

  btnPrev.addEventListener("click", () => scrollByDir(-1));
  btnNext.addEventListener("click", () => scrollByDir(1));

  // Keyboard on viewport
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") scrollByDir(-1);
    if (e.key === "ArrowRight") scrollByDir(1);
  });

  // Update dot on manual scroll
  let t = null;
  track.addEventListener("scroll", () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      setActiveDot(getIndexByScroll());
    }, 80);
  });

  // Init
  setActiveDot(0);

  // Optional auto-advance (delikatnie). Możesz wyłączyć, ustawiając AUTO = false
  const AUTO = true;
  let autoTimer = null;

  const startAuto = () => {
    if (!AUTO) return;
    stopAuto();
    autoTimer = window.setInterval(() => {
      const idx = getIndexByScroll();
      const next = idx >= cards.length - 1 ? 0 : idx + 1;
      scrollToIndex(next);
    }, 4500);
  };

  const stopAuto = () => {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = null;
  };

  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);
  root.addEventListener("focusin", stopAuto);
  root.addEventListener("focusout", startAuto);

  startAuto();
})();
