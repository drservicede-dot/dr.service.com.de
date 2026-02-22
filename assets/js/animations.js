(() => {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (!els.length) return;

  // If user prefers reduced motion, just show everything
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { root: null, threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
})();
