/*
 * FR : Ce script restaure le thème et la langue avant le premier affichage.
 * EN: This script restores theme and language before the first paint.
 */
(function applySavedAppearance() {
  'use strict';

  const storageKey = 'survey-template-preferences-v2';
  const supportedLanguages = new Set(['fr', 'en']);
  const supportedThemes = new Set(['dark', 'light']);
  const browserLanguage = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  let preferences = {};

  try {
    preferences = JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch {
    // FR : Une préférence corrompue ne doit jamais empêcher le questionnaire de démarrer.
    // EN: A corrupted preference must never prevent the survey from starting.
    preferences = {};
  }

  document.documentElement.lang = supportedLanguages.has(preferences.language)
    ? preferences.language
    : browserLanguage;
  document.documentElement.dataset.theme = supportedThemes.has(preferences.theme)
    ? preferences.theme
    : systemTheme;
})();
