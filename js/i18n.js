export const I18N = {
  es: {
    titleIndex: "Generador One-shot D&D",
    btnInstructions: "Instrucciones",
    goToGame: "Generar",

    instructionsTitle: "Instrucciones",
    instructionsBody:
      "Elige si quieres el one-shot SIN GANCHO o CON GANCHO.\nPulsa GENERAR para ir al generador.\nEn la siguiente pantalla puedes volver a generar y copiarlo entero.",

    themeLabel: "Tema",
    light: "Claro",
    dark: "Oscuro",
    langLabel: "Idioma",

    modeLegend: "Modo",
    modeSimple: "Sin gancho",
    modeFull: "Con gancho",

    titleGame: "Generador One-shot",
    btnBack: "Volver",
    btnReroll: "Generar",
    btnCopy: "Copiar todo",
    resultTitle: "Resultado",

    secHook: "Gancho",
    secObjective: "Objetivo",
    secLocation: "Lugar",
    secOpposition: "Oposición"
  },

  en: {
    titleIndex: "D&D One-shot Generator",
    btnInstructions: "Instructions",
    goToGame: "Generate",

    instructionsTitle: "Instructions",
    instructionsBody:
      "Choose whether you want NO HOOK or WITH HOOK.\nPress GENERATE to open the generator.\nOn the next screen you can reroll and copy everything.",

    themeLabel: "Theme",
    light: "Light",
    dark: "Dark",
    langLabel: "Language",

    modeLegend: "Mode",
    modeSimple: "No hook",
    modeFull: "With hook",

    titleGame: "One-shot Generator",
    btnBack: "Back",
    btnReroll: "Generate",
    btnCopy: "Copy all",
    resultTitle: "Result",

    secHook: "Hook",
    secObjective: "Objective",
    secLocation: "Location",
    secOpposition: "Opposition"
  }
};

export function t(lang, key) {
  return I18N[lang]?.[key] ?? I18N.es[key] ?? key;
}
