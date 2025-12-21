(() => {
  const ENDPOINT = "https://formspree.io/f/mqarvpve";

  const form = document.getElementById("dr-anfrage-form");
  const submitBtn = document.getElementById("submitBtn");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const alertBox = document.getElementById("formAlert");

  const panels = Array.from(document.querySelectorAll(".service-panel[data-service]"));
  const empty = document.querySelector("[data-service-empty]");
  const radios = Array.from(document.querySelectorAll('input[name="bereich"]'));

  const saunaToggle = document.getElementById("f_sauna_toggle");
  const saunaPanel = document.querySelector('[data-subpanel="fitness-sauna"]');

  if (!form) return;

  const setStatus = (mode, text) => {
    statusText.textContent = text;

    if (mode === "ready") statusDot.style.background = "rgba(34,34,34,.35)";
    if (mode === "sending") statusDot.style.background = "#D8C9B4";
    if (mode === "ok") statusDot.style.background = "#2ecc71";
    if (mode === "bad") statusDot.style.background = "#e74c3c";
  };

  const showAlert = (type, msg) => {
    alertBox.className = "alert is-show " + (type === "ok" ? "is-ok" : "is-bad");
    alertBox.textContent = msg;
  };

  const clearAlert = () => {
    alertBox.className = "alert";
    alertBox.textContent = "";
  };

  const setSendingUI = (sending) => {
    submitBtn.disabled = sending;
    submitBtn.classList.toggle("is-sending", sending);
    form.classList.toggle("is-sending", sending);
  };

  const validateNative = () => {
    if (form.checkValidity()) return true;
    form.reportValidity();
    return false;
  };

  // ----- Dynamic panels -----
  const hideAllPanels = () => {
    panels.forEach((p) => (p.hidden = true));
    if (empty) empty.hidden = false;
  };

  const showPanel = (serviceName) => {
    hideAllPanels();
    const p = panels.find((x) => x.getAttribute("data-service") === serviceName);
    if (p) {
      p.hidden = false;
      if (empty) empty.hidden = true;
    }
  };

  radios.forEach((r) => {
    r.addEventListener("change", () => {
      showPanel(r.value);
      if (saunaPanel) saunaPanel.hidden = !(saunaToggle && saunaToggle.checked);
    });
  });

  if (saunaToggle && saunaPanel) {
    saunaToggle.addEventListener("change", () => {
      saunaPanel.hidden = !saunaToggle.checked;

      if (!saunaToggle.checked) {
        saunaPanel.querySelectorAll("input, select, textarea").forEach((el) => {
          if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
            el.checked = false;
          } else {
            el.value = "";
          }
        });
      }
    });
  }

  // Init
  hideAllPanels();
  setStatus("ready", "Bereit");

  // ----- Submit -----
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlert();

    if (!validateNative()) {
      setStatus("bad", "Bitte prüfen");
      return;
    }

    try {
      setSendingUI(true);
      setStatus("sending", "Wird gesendet…");

      const formData = new FormData(form);

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData
      });

      if (!res.ok) {
        let msg = "Senden fehlgeschlagen. Bitte später erneut versuchen.";
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map((x) => x.message).join(" ");
          }
        } catch (_) {}
        throw new Error(msg);
      }

      setStatus("ok", "Gesendet");
      showAlert("ok", "Danke! Anfrage ist raus. Bitte kurz warten – die Kontrollleuchte ist jetzt grün.");
      form.reset();

      hideAllPanels();
      if (saunaPanel) saunaPanel.hidden = true;

      setTimeout(() => setStatus("ready", "Bereit"), 6000);
    } catch (err) {
      setStatus("bad", "Fehler");
      showAlert("bad", err instanceof Error ? err.message : "Fehler beim Senden.");
    } finally {
      setSendingUI(false);
    }
  });
})();
(() => {
  const ENDPOINT = "https://formspree.io/f/mqarvpve";

  const form = document.getElementById("dr-anfrage-form");
  const submitBtn = document.getElementById("submitBtn");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const alertBox = document.getElementById("formAlert");

  const panels = Array.from(document.querySelectorAll(".service-panel[data-service]"));
  const empty = document.querySelector("[data-service-empty]");
  const radios = Array.from(document.querySelectorAll('input[name="bereich"]'));

  const saunaToggle = document.getElementById("f_sauna_toggle");
  const saunaPanel = document.querySelector('[data-subpanel="fitness-sauna"]');

  const detailsFieldset = document.querySelectorAll(".fieldset")[1]; // 2) Details
  const detailsWrap = document.querySelector(".service-details");

  if (!form) return;

  const setStatus = (mode, text) => {
    statusText.textContent = text;
    if (mode === "ready") statusDot.style.background = "rgba(34,34,34,.35)";
    if (mode === "sending") statusDot.style.background = "#D8C9B4";
    if (mode === "ok") statusDot.style.background = "#2ecc71";
    if (mode === "bad") statusDot.style.background = "#e74c3c";
  };

  const showAlert = (type, msg) => {
    alertBox.className = "alert is-show " + (type === "ok" ? "is-ok" : "is-bad");
    alertBox.textContent = msg;
  };

  const clearAlert = () => {
    alertBox.className = "alert";
    alertBox.textContent = "";
  };

  const setSendingUI = (sending) => {
    submitBtn.disabled = sending;
    submitBtn.classList.toggle("is-sending", sending);
    form.classList.toggle("is-sending", sending);
  };

  const validateNative = () => {
    if (form.checkValidity()) return true;
    form.reportValidity();
    return false;
  };

  const hideAllPanels = () => {
    panels.forEach((p) => (p.hidden = true));
    if (empty) empty.hidden = false;
  };

  const showPanel = (serviceName) => {
    hideAllPanels();
    const p = panels.find((x) => x.getAttribute("data-service") === serviceName);
    if (p) {
      p.hidden = false;
      if (empty) empty.hidden = true;
    }
    return p || null;
  };

  const focusDetails = () => {
    if (!detailsFieldset) return;
    detailsFieldset.scrollIntoView({ behavior: "smooth", block: "start" });

    // highlight wrapper
    if (!detailsWrap) return;
    detailsWrap.classList.add("flash");
    window.setTimeout(() => detailsWrap.classList.remove("flash"), 900);
  };

  // Radios -> show panel + scroll
  radios.forEach((r) => {
    r.addEventListener("change", () => {
      showPanel(r.value);
      if (saunaPanel) saunaPanel.hidden = !(saunaToggle && saunaToggle.checked);
      focusDetails();
    });
  });

  // Sauna toggle
  if (saunaToggle && saunaPanel) {
    saunaToggle.addEventListener("change", () => {
      saunaPanel.hidden = !saunaToggle.checked;

      if (!saunaToggle.checked) {
        saunaPanel.querySelectorAll("input, select, textarea").forEach((el) => {
          if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
            el.checked = false;
          } else {
            el.value = "";
          }
        });
      }
    });
  }

  // Init
  hideAllPanels();
  setStatus("ready", "Bereit");

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlert();

    if (!validateNative()) {
      setStatus("bad", "Bitte prüfen");
      return;
    }

    try {
      setSendingUI(true);
      setStatus("sending", "Wird gesendet…");

      const formData = new FormData(form);

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData
      });

      if (!res.ok) {
        let msg = "Senden fehlgeschlagen. Bitte später erneut versuchen.";
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map((x) => x.message).join(" ");
          }
        } catch (_) {}
        throw new Error(msg);
      }

      setStatus("ok", "Gesendet");
      showAlert("ok", "Danke! Anfrage ist raus. Bitte kurz warten – die Kontrollleuchte ist jetzt grün.");
      form.reset();

      hideAllPanels();
      if (saunaPanel) saunaPanel.hidden = true;

      setTimeout(() => setStatus("ready", "Bereit"), 6000);
    } catch (err) {
      setStatus("bad", "Fehler");
      showAlert("bad", err instanceof Error ? err.message : "Fehler beim Senden.");
    } finally {
      setSendingUI(false);
    }
  });
})();
