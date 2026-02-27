import { getLang, getMode, applyThemeToBody } from "./storage.js";
import { t } from "./i18n.js";
import { DATA, SECTIONS } from "./data.js";

const el = (id) => document.getElementById(id);

const OMIT_IN_SIMPLE = new Set(["hook"]); // simple = Sin gancho
let lastCopyText = "";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let lastSignature = "";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function signatureFor(res) {
  return `${res.hook}|${res.objective}|${res.location}|${res.opposition}`;
}

function sectionLabel(lang, section) {
  return lang === "en" ? section.label_en : section.label_es;
}

function getActiveSections() {
  const mode = getMode();
  if (mode === "simple") return SECTIONS.filter(s => !OMIT_IN_SIMPLE.has(s.key));
  return SECTIONS;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function generateResult() {
  const lang = getLang();
  const pool = DATA[lang] || DATA.es;

  for (let attempt = 0; attempt < 12; attempt++) {
    const res = {
      hook: pool.hook?.length ? pick(pool.hook) : "—",
      objective: pool.objective?.length ? pick(pool.objective) : "—",
      location: pool.location?.length ? pick(pool.location) : "—",
      opposition: pool.opposition?.length ? pick(pool.opposition) : "—"
    };

    const sig = signatureFor(res);
    if (sig !== lastSignature) {
      lastSignature = sig;
      return res;
    }
  }

  return { hook: "—", objective: "—", location: "—", opposition: "—" };
}

function renderUI() {
  const lang = getLang();
  document.documentElement.lang = lang;
  applyThemeToBody();

  el("title").textContent = t(lang, "titleGame");
  el("btnBack").textContent = t(lang, "btnBack");
  el("btnGenerate").textContent = t(lang, "btnReroll");
  el("btnCopy").textContent = t(lang, "btnCopy");
  el("resultTitle").textContent = t(lang, "resultTitle");
}

function renderResult(res) {
  const lang = getLang();
  const activeSections = getActiveSections();

  const lines = [];
  const resultsEl = el("results");
  resultsEl.innerHTML = "";

  for (const s of activeSections) {
    const label = sectionLabel(lang, s);
    const value = res[s.key] ?? "—";

    lines.push(`${label}: ${value}`);

    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `<strong>${escapeHtml(label)}:</strong> <span>${escapeHtml(value)}</span>`;
    resultsEl.appendChild(row);
  }

  // Texto para copiar (etiquetado)
  lastCopyText = lines.join("\n");

  // Allbox (compacto + gancho si aplica)
  const modeNow = getMode();
  const compact = `${sectionLabel(lang, SECTIONS.find(s=>s.key==="objective"))}: ${res.objective}
${sectionLabel(lang, SECTIONS.find(s=>s.key==="location"))}: ${res.location}
${sectionLabel(lang, SECTIONS.find(s=>s.key==="opposition"))}: ${res.opposition}`;

  let html = `<div class="allbox-main">${escapeHtml(compact)}</div>`;

  if (modeNow === "full") {
    const hookLabel = sectionLabel(lang, SECTIONS.find(s => s.key === "hook"));
    html = `<div class="allbox-main"><strong>${escapeHtml(hookLabel)}:</strong> ${escapeHtml(res.hook)}</div>` +
           `<div class="allbox-extra">${escapeHtml(compact).replaceAll("\n","<br>")}</div>`;
  } else {
    html = `<div class="allbox-main">${escapeHtml(compact).replaceAll("\n","<br>")}</div>`;
  }

  el("allBox").innerHTML = html;
}

function generate() {
  const res = generateResult();
  renderResult(res);
}

let isRolling = false;

async function rollAnimation() {
  if (isRolling) return;
  isRolling = true;

  const btn = el("btnGenerate");
  btn.disabled = true;

  const lang = getLang();
  const pool = DATA[lang] || DATA.es;

  const ticks = 12;
  const tickMs = 50;

  for (let i = 0; i < ticks; i++) {
    const fake = {
      hook: pool.hook?.length ? pick(pool.hook) : "—",
      objective: pool.objective?.length ? pick(pool.objective) : "—",
      location: pool.location?.length ? pick(pool.location) : "—",
      opposition: pool.opposition?.length ? pick(pool.opposition) : "—"
    };
    renderResult(fake);
    await sleep(tickMs);
  }

  renderResult(generateResult());

  btn.disabled = false;
  isRolling = false;
}

el("btnBack").addEventListener("click", () => (window.location.href = "index.html"));
el("btnGenerate").addEventListener("click", rollAnimation);

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1000);
}

el("btnCopy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(lastCopyText || "");
    showToast(getLang() === "en" ? "Copied!" : "¡Copiado!");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = lastCopyText || "";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast(getLang() === "en" ? "Copied!" : "¡Copiado!");
  }
});

renderUI();
generate();
