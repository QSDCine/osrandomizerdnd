import {
  getLang, setLang,
  getTheme, setTheme,
  applyThemeToBody,
  getMode, setMode
} from "./storage.js";
import { t } from "./i18n.js";

const el = (id) => document.getElementById(id);

function setActiveLangButton(lang) {
  el("btnLangEs").classList.toggle("active", lang === "es");
  el("btnLangEn").classList.toggle("active", lang === "en");
}

function render() {
  const lang = getLang();
  const theme = getTheme();
  const mode = getMode();

  document.documentElement.lang = lang;
  applyThemeToBody();

  // UI
  el("btnInstructions").textContent = t(lang, "btnInstructions");
  el("btnGo").textContent = t(lang, "goToGame");

  el("btnTheme").textContent = theme === "dark" ? "🌙" : "☀️";
  el("btnTheme").setAttribute(
    "aria-label",
    theme === "dark" ? (lang === "en" ? "Switch to light theme" : "Cambiar a tema claro")
                   : (lang === "en" ? "Switch to dark theme" : "Cambiar a tema oscuro")
  );

  el("modeLegend").textContent = t(lang, "modeLegend");
  el("modeSimpleText").textContent = t(lang, "modeSimple");
  el("modeFullText").textContent = t(lang, "modeFull");

  el("modeSimple").checked = mode === "simple";
  el("modeFull").checked = mode === "full";

  setActiveLangButton(lang);

  // Dialog
  el("insTitle").textContent = t(lang, "instructionsTitle");
  el("insBody").textContent = t(lang, "instructionsBody");
}

el("btnLangEs").addEventListener("click", () => {
  setLang("es");
  render();
});

el("btnLangEn").addEventListener("click", () => {
  setLang("en");
  render();
});

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener("change", (e) => {
    setMode(e.target.value);
    render();
  });
});

el("btnTheme").addEventListener("click", () => {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  render();
});

el("btnInstructions").addEventListener("click", () => el("dlg").showModal());

el("btnGo").addEventListener("click", () => {
  window.location.href = "game.html";
});

render();

// SW register (por si acaso)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
