/*
 * FR : Les préférences et le brouillon utilisent des clés distinctes et des formats validés.
 * EN: Preferences and the draft use separate keys and validated formats.
 */

export const PREFERENCES_KEY = 'survey-template-preferences-v2';
export const DRAFT_KEY = 'survey-template-draft-v2';

const allowedLanguages = new Set(['fr', 'en']);
const allowedThemes = new Set(['dark', 'light']);

export function loadPreferences() {
  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
  } catch {
    saved = {};
  }

  return {
    language: allowedLanguages.has(saved.language) ? saved.language : document.documentElement.lang,
    theme: allowedThemes.has(saved.theme) ? saved.theme : document.documentElement.dataset.theme
  };
}

export function savePreferences({ language, theme }) {
  const safePreferences = {
    language: allowedLanguages.has(language) ? language : 'fr',
    theme: allowedThemes.has(theme) ? theme : 'dark'
  };

  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(safePreferences));
  } catch {
    // FR : Le questionnaire reste utilisable quand le navigateur refuse le stockage local.
    // EN: The survey remains usable when the browser blocks local storage.
  }
}

export function loadDraft(expectedVersion) {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');

    if (!draft || draft.version !== expectedVersion || typeof draft.answers !== 'object') {
      return null;
    }

    return {
      version: draft.version,
      answers: { ...draft.answers },
      currentIndex: Number.isInteger(draft.currentIndex) ? Math.max(0, draft.currentIndex) : 0,
      phase: draft.phase === 'review' ? 'review' : 'question',
      startedAt: typeof draft.startedAt === 'string' ? draft.startedAt : new Date().toISOString(),
      updatedAt: typeof draft.updatedAt === 'string' ? draft.updatedAt : null
    };
  } catch {
    return null;
  }
}

export function saveDraft({ version, answers, currentIndex, phase, startedAt }) {
  const draft = {
    version,
    answers,
    currentIndex,
    phase: phase === 'review' ? 'review' : 'question',
    startedAt,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return draft.updatedAt;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // FR : L'état en mémoire sera tout de même remis à zéro par le contrôleur.
    // EN: The in-memory state will still be reset by the controller.
  }
}
