/*
 * FR : Ce contrôleur relie la configuration, l'interface, le stockage et l'empreinte finale.
 * EN: This controller connects configuration, interface, storage, and the final fingerprint.
 */

import {
  formatDuration,
  formatTime,
  getLanguage,
  setLanguage,
  t,
} from './translations.js'
import { normalizeAnswer, validateAnswer } from './questionTypes.js'
import { SignalChart } from './signalChart.js'
import {
  clearDraft,
  loadDraft,
  loadPreferences,
  saveDraft,
  savePreferences,
} from './storage.js'
import { SURVEY_CONFIG } from './surveyConfig.js'
import {
  collectElements,
  downloadJson,
  hideValidation,
  renderCompletion,
  renderJourney,
  renderQuestion,
  renderReview,
  setPressedState,
  showToast,
  showValidation,
} from './ui.js'

const elements = collectElements()
const preferences = loadPreferences()
const restoredDraft = loadDraft(SURVEY_CONFIG.version)
const restoredAnswers = sanitizeAnswers(restoredDraft?.answers ?? {})
const restoredPhase =
  restoredDraft?.phase === 'review' && allAnswersAreValid(restoredAnswers)
    ? 'review'
    : 'question'

// FR : L'état central suffit à reconstruire n'importe quel écran sans lire le DOM.
// EN: The central state is enough to rebuild any screen without reading the DOM.
const state = {
  phase: restoredPhase,
  currentIndex: clampIndex(restoredDraft?.currentIndex ?? 0),
  answers: restoredAnswers,
  startedAt: restoredDraft?.startedAt ?? new Date().toISOString(),
  lastSavedAt: restoredDraft?.updatedAt ?? null,
  submittedAt: null,
  language: preferences.language === 'en' ? 'en' : 'fr',
  theme: preferences.theme === 'light' ? 'light' : 'dark',
}

let signalChart = null

initialize()

function initialize() {
  document.documentElement.dataset.theme = state.theme
  setLanguage(state.language)
  state.language = getLanguage()
  bindGlobalEvents()
  render()

  if (Object.keys(restoredAnswers).length > 0) {
    showToast(elements.toastRegion, t('draftRestoredToast'))
  }
}

function bindGlobalEvents() {
  elements.languageButtons.forEach((button) => {
    button.addEventListener('click', () =>
      changeLanguage(button.dataset.language),
    )
  })

  elements.themeToggle.addEventListener('click', toggleTheme)
  elements.backButton.addEventListener('click', goBack)
  elements.nextButton.addEventListener('click', goNext)
  elements.resetDraft.addEventListener('click', openResetDialog)
  elements.cancelReset.addEventListener('click', closeResetDialog)
  elements.confirmReset.addEventListener('click', () => {
    closeResetDialog()
    restartSession()
  })

  // FR : Un clic sur l'arrière-plan du dialogue agit comme le bouton Annuler.
  // EN: A click on the dialog backdrop behaves like the Cancel button.
  elements.resetDialog.addEventListener('click', (event) => {
    if (event.target === elements.resetDialog) {
      closeResetDialog()
    }
  })
}

function render() {
  signalChart?.destroy()
  signalChart = null
  setPressedState(elements.languageButtons, state.language)
  elements.themeToggle.dataset.theme = state.theme
  renderJourneyView()

  if (state.phase === 'review') {
    renderReview({
      elements,
      config: SURVEY_CONFIG,
      answers: state.answers,
      translate: t,
      onEdit: editQuestion,
    })
    return
  }

  if (state.phase === 'complete') {
    const canvas = renderCompletion({
      elements,
      config: SURVEY_CONFIG,
      answers: state.answers,
      duration: formatDuration(getSessionDuration()),
      translate: t,
      onDownload: exportResponses,
      onRestart: restartSession,
    })
    signalChart = new SignalChart(canvas)
    signalChart.update(SURVEY_CONFIG.questions, state.answers)
    return
  }

  const question = SURVEY_CONFIG.questions[state.currentIndex]
  renderQuestion({
    elements,
    question,
    index: state.currentIndex,
    total: SURVEY_CONFIG.questions.length,
    answer: state.answers[question.id],
    translate: t,
    onAnswer: (answer) => updateAnswer(question, answer),
  })
}

function renderJourneyView() {
  renderJourney({
    elements,
    config: SURVEY_CONFIG,
    state,
    translate: t,
    formatTime,
    onStep: editQuestion,
  })
}

function updateAnswer(question, answer) {
  const normalized = normalizeAnswer(question, answer)

  // FR : Une réponse partielle reste sauvegardée, même si elle n'est pas encore valide.
  // EN: A partial response remains saved even when it is not valid yet.
  if (hasContent(normalized)) {
    state.answers[question.id] = normalized
  } else {
    delete state.answers[question.id]
  }

  hideValidation(elements)
  persistDraft()
  renderJourneyView()
}

function goNext() {
  if (state.phase === 'review') {
    submitSurvey()
    return
  }

  const question = SURVEY_CONFIG.questions[state.currentIndex]
  const validation = validateAnswer(question, state.answers[question.id])

  if (!validation.valid) {
    showValidation(elements, t(validation.errorKey, validation.parameters))
    return
  }

  if (state.currentIndex === SURVEY_CONFIG.questions.length - 1) {
    state.phase = 'review'
  } else {
    state.currentIndex += 1
  }

  persistDraft()
  render()
}

function goBack() {
  if (state.phase === 'review') {
    state.phase = 'question'
    state.currentIndex = SURVEY_CONFIG.questions.length - 1
    persistDraft()
    render()
    return
  }

  if (state.currentIndex > 0) {
    state.currentIndex -= 1
    persistDraft()
    render()
  }
}

function editQuestion(index) {
  state.phase = 'question'
  state.currentIndex = clampIndex(index)
  persistDraft()
  render()
}

function submitSurvey() {
  const invalidIndex = SURVEY_CONFIG.questions.findIndex(
    (question) => !validateAnswer(question, state.answers[question.id]).valid,
  )

  // FR : Cette garde protège aussi contre un brouillon ancien ou modifié manuellement.
  // EN: This guard also protects against an old or manually modified draft.
  if (invalidIndex >= 0) {
    state.phase = 'question'
    state.currentIndex = invalidIndex
    render()
    const question = SURVEY_CONFIG.questions[invalidIndex]
    const validation = validateAnswer(question, state.answers[question.id])
    window.requestAnimationFrame(() => {
      showValidation(elements, t(validation.errorKey, validation.parameters))
    })
    return
  }

  state.phase = 'complete'
  state.submittedAt = new Date().toISOString()
  state.lastSavedAt = null
  clearDraft()
  render()
}

function changeLanguage(language) {
  const nextLanguage = language === 'en' ? 'en' : 'fr'

  if (nextLanguage === state.language) {
    return
  }

  state.language = nextLanguage
  setLanguage(state.language)
  saveCurrentPreferences()
  render()
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = state.theme
  elements.themeToggle.dataset.theme = state.theme
  saveCurrentPreferences()
  window.requestAnimationFrame(() => signalChart?.render())
}

function openResetDialog() {
  if (typeof elements.resetDialog.showModal === 'function') {
    elements.resetDialog.showModal()
  } else {
    elements.resetDialog.setAttribute('open', '')
  }
}

function closeResetDialog() {
  if (
    elements.resetDialog.open &&
    typeof elements.resetDialog.close === 'function'
  ) {
    elements.resetDialog.close()
  } else {
    elements.resetDialog.removeAttribute('open')
  }
}

function restartSession() {
  signalChart?.destroy()
  signalChart = null
  clearDraft()
  state.phase = 'question'
  state.currentIndex = 0
  state.answers = {}
  state.startedAt = new Date().toISOString()
  state.lastSavedAt = null
  state.submittedAt = null
  render()
  showToast(elements.toastRegion, t('draftResetToast'))
}

function persistDraft() {
  if (state.phase === 'complete') {
    return
  }

  state.lastSavedAt = saveDraft({
    version: SURVEY_CONFIG.version,
    answers: { ...state.answers },
    currentIndex: state.currentIndex,
    phase: state.phase,
    startedAt: state.startedAt,
  })
}

function saveCurrentPreferences() {
  savePreferences({ language: state.language, theme: state.theme })
}

function exportResponses() {
  const payload = {
    schemaVersion: 1,
    survey: {
      id: SURVEY_CONFIG.id,
      version: SURVEY_CONFIG.version,
    },
    session: {
      startedAt: state.startedAt,
      submittedAt: state.submittedAt,
      durationMilliseconds: getSessionDuration(),
      language: state.language,
    },
    responses: SURVEY_CONFIG.questions.map((question) => ({
      questionId: question.id,
      type: question.type,
      answer: state.answers[question.id],
    })),
  }
  const date = (state.submittedAt ?? new Date().toISOString()).slice(0, 10)
  downloadJson(payload, `${SURVEY_CONFIG.id}-${date}.json`)
  showToast(elements.toastRegion, t('exportToast'))
}

function getSessionDuration() {
  const start = new Date(state.startedAt).getTime()
  const end = new Date(state.submittedAt ?? Date.now()).getTime()
  return Number.isFinite(start) && Number.isFinite(end)
    ? Math.max(0, end - start)
    : 0
}

function sanitizeAnswers(rawAnswers) {
  return SURVEY_CONFIG.questions.reduce((answers, question) => {
    const normalized = normalizeAnswer(question, rawAnswers[question.id])

    if (hasContent(normalized)) {
      answers[question.id] = normalized
    }

    return answers
  }, {})
}

function allAnswersAreValid(answers) {
  return SURVEY_CONFIG.questions.every(
    (question) => validateAnswer(question, answers[question.id]).valid,
  )
}

function hasContent(answer) {
  if (Array.isArray(answer)) {
    return answer.length > 0
  }

  if (typeof answer === 'string') {
    return answer.trim().length > 0
  }

  return answer !== null && answer !== undefined
}

function clampIndex(index) {
  const numericIndex = Number.isInteger(index) ? index : 0
  return Math.min(Math.max(numericIndex, 0), SURVEY_CONFIG.questions.length - 1)
}
