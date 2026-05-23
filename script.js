const SITE_CONFIG = {
  slogan: "Sauber. Mit Plan.",
  hourlyFrom: 25,
  discountPercent: 10,
  promoStorageKey: "drServicePromoClosedAt",
  promoRepeatDays: 7,
  promoDelayMs: 2600,
  whatsappNumber: "491774615992",
  email: "dr.service.de@gmail.com"
};

document.addEventListener("DOMContentLoaded", () => {
  applySiteConfig();
  initHeader();
  initNavigation();
  initReveal();
  initSplash();
  initPromoModal();
  initContactForm();
  setCurrentYear();
});

function applySiteConfig() {
  document.querySelectorAll("[data-hourly-from]").forEach((node) => {
    node.textContent = `${SITE_CONFIG.hourlyFrom} €`;
  });

  document.querySelectorAll("[data-discount]").forEach((node) => {
    node.textContent = `${SITE_CONFIG.discountPercent} %`;
  });

  document.querySelectorAll("[data-slogan]").forEach((node) => {
    node.textContent = SITE_CONFIG.slogan;
  });
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) {
    return;
  }

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    return;
  }

  const closeNav = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

function initReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initSplash() {
  const splash = document.getElementById("splash-screen");
  if (!splash) {
    return;
  }

  const hideDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 180 : 1450;

  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    window.setTimeout(() => {
      splash.hidden = true;
    }, 600);
  }, hideDelay);
}

function initPromoModal() {
  const modal = document.getElementById("promo-modal");
  if (!modal || !shouldShowPromo()) {
    return;
  }

  const closeTargets = modal.querySelectorAll("[data-promo-close]");

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    rememberPromoClosed();
  };

  const openModal = () => {
    modal.hidden = false;
    document.body.classList.add("modal-open");
  };

  closeTargets.forEach((target) => {
    target.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  window.setTimeout(openModal, SITE_CONFIG.promoDelayMs);
}

function shouldShowPromo() {
  try {
    const closedAt = window.localStorage.getItem(SITE_CONFIG.promoStorageKey);
    if (!closedAt) {
      return true;
    }

    const elapsed = Date.now() - Number(closedAt);
    const repeatAfter = SITE_CONFIG.promoRepeatDays * 24 * 60 * 60 * 1000;
    return Number.isFinite(elapsed) && elapsed > repeatAfter;
  } catch {
    return true;
  }
}

function rememberPromoClosed() {
  try {
    window.localStorage.setItem(SITE_CONFIG.promoStorageKey, String(Date.now()));
  } catch {
    // Ignore storage issues and keep the page usable.
  }
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  const whatsappButton = document.getElementById("contact-whatsapp");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const summary = buildContactSummary(form);
    const subject = "Anfrage an DR-service Gebäudereinigung";
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
  });

  if (!whatsappButton) {
    return;
  }

  whatsappButton.addEventListener("click", () => {
    if (!form.reportValidity()) {
      return;
    }

    const summary = buildContactSummary(form);
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(summary)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function buildContactSummary(form) {
  const formData = new FormData(form);
  const firstName = getValue(formData, "firstName");
  const lastName = getValue(formData, "lastName");
  const company = getValue(formData, "company");
  const phone = getValue(formData, "phone");
  const email = getValue(formData, "email");
  const message = getValue(formData, "message");

  return [
    "Hallo DR-service,",
    "",
    "ich moechte eine Reinigungsanfrage stellen.",
    "",
    `Vorname: ${firstName}`,
    `Nachname: ${lastName}`,
    `Firma: ${company || "-"}`,
    `Telefon: ${phone}`,
    `E-Mail: ${email}`,
    "",
    "Nachricht:",
    message,
    "",
    "Hinweis:",
    "Bitte senden Sie mir nach kurzer Ruecksprache oder Besichtigung ein passendes Angebot.",
    "Mir ist bekannt, dass die erste Preisorientierung je nach Objekt, Aufwand, Rabatten und Verhandlung abweichen kann."
  ].join("\n");
}

function getValue(formData, key) {
  return String(formData.get(key) || "").trim();
}

function setCurrentYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = year;
  });
}
