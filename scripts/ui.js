/*
 * FR : Ce module rend chaque écran avec l'API DOM et ne reçoit jamais de HTML à injecter.
 * EN: This module renders every screen with the DOM API and never receives HTML to inject.
 */

import {
  createQuestionControl,
  getAnswerLabel,
  getQuestionTypeKey,
  isAnswerPresent
} from './questionTypes.js';

const requiredIds = [
  'theme-toggle',
  'survey-title',
  'survey-description',
  'progress-count',
  'progress-track',
  'progress-fill',
  'step-list',
  'draft-state',
  'reset-draft',
  'view-eyebrow',
  'view-title',
  'view-description',
  'screen-content',
  'validation-message',
  'survey-navigation',
  'back-button',
  'next-button',
  'reset-dialog',
  'cancel-reset',
  'confirm-reset',
  'toast-region'
];

export function collectElements() {
  const elements = {};

  requiredIds.forEach((id) => {
    const element = document.getElementById(id);

    if (!element) {
      throw new Error(`Missing interface element: #${id}`);
    }

    const propertyName = id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    elements[propertyName] = element;
  });

  elements.languageButtons = [...document.querySelectorAll('[data-language]')];
  return elements;
}

export function renderJourney({ elements, config, state, translate, formatTime, onStep }) {
  const total = config.questions.length;
  const currentPosition = state.phase === 'question' ? state.currentIndex + 1 : total;
  const progress = state.phase === 'complete' || state.phase === 'review'
    ? 100
    : (currentPosition / total) * 100;

  elements.surveyTitle.textContent = translate(config.titleKey);
  elements.surveyDescription.textContent = translate(config.descriptionKey);
  elements.progressCount.textContent = `${currentPosition} / ${total}`;
  elements.progressFill.style.width = `${progress}%`;
  elements.progressTrack.setAttribute('aria-valuenow', String(Math.round(progress)));
  elements.draftState.textContent = state.lastSavedAt
    ? translate('draftSaved', { time: formatTime(state.lastSavedAt) })
    : translate('draftEmpty');
  elements.resetDraft.hidden = state.phase === 'complete';
  elements.resetDraft.disabled = state.phase === 'question'
    && state.currentIndex === 0
    && Object.keys(state.answers).length === 0;

  const steps = config.questions.map((question, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const number = document.createElement('span');
    const label = document.createElement('span');
    const marker = document.createElement('span');
    const answered = isAnswerPresent(question, state.answers[question.id]);
    const current = state.phase === 'question' && index === state.currentIndex;
    const reachable = state.phase !== 'question' || index <= state.currentIndex || answered;
    button.type = 'button';
    button.className = 'step-button';
    button.disabled = !reachable;
    button.dataset.state = current ? 'current' : answered ? 'answered' : 'pending';

    if (current) {
      button.setAttribute('aria-current', 'step');
    }

    number.className = 'step-number';
    number.textContent = String(index + 1).padStart(2, '0');
    label.className = 'step-label';
    label.textContent = translate(question.shortKey);
    marker.className = 'step-marker';
    marker.setAttribute('aria-hidden', 'true');
    button.append(number, label, marker);
    button.addEventListener('click', () => onStep(index));
    item.append(button);
    return item;
  });

  elements.stepList.replaceChildren(...steps);
}

export function renderQuestion({ elements, question, index, total, answer, translate, onAnswer }) {
  elements.viewEyebrow.textContent = translate('questionEyebrow', { current: index + 1, total });
  elements.viewTitle.textContent = translate(question.textKey);
  elements.viewDescription.textContent = translate(question.descriptionKey);
  elements.screenContent.className = 'screen-content question-screen';

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  const meta = document.createElement('div');
  const type = document.createElement('span');
  const required = document.createElement('span');
  legend.className = 'sr-only';
  legend.textContent = translate(question.textKey);
  fieldset.className = 'question-fieldset';
  fieldset.setAttribute('aria-describedby', 'view-description');
  meta.className = 'question-meta';
  type.className = 'type-label';
  type.textContent = translate(getQuestionTypeKey(question));
  required.className = 'required-label';
  required.textContent = translate('requiredLabel');
  meta.append(type, required);
  fieldset.append(
    legend,
    meta,
    createQuestionControl({ question, answer, translate, onAnswer })
  );
  elements.screenContent.replaceChildren(fieldset);
  elements.surveyNavigation.hidden = false;
  elements.backButton.disabled = index === 0;
  elements.backButton.textContent = translate('backButton');
  elements.nextButton.textContent = translate(index === total - 1 ? 'reviewButton' : 'nextButton');
  hideValidation(elements);
  focusViewTitle(elements);
}

export function renderReview({ elements, config, answers, translate, onEdit }) {
  elements.viewEyebrow.textContent = translate('reviewEyebrow');
  elements.viewTitle.textContent = translate('reviewTitle');
  elements.viewDescription.textContent = translate('reviewDescription');
  elements.screenContent.className = 'screen-content review-screen';

  const list = document.createElement('ol');
  list.className = 'review-list';

  const items = config.questions.map((question, index) => {
    const item = document.createElement('li');
    const heading = document.createElement('div');
    const number = document.createElement('span');
    const prompt = document.createElement('h2');
    const editButton = document.createElement('button');
    const answer = document.createElement('p');
    item.className = 'review-item';
    heading.className = 'review-heading';
    number.className = 'review-number';
    number.textContent = String(index + 1).padStart(2, '0');
    prompt.textContent = translate(question.textKey);
    editButton.type = 'button';
    editButton.className = 'quiet-button';
    editButton.textContent = translate('editAnswer', { number: index + 1 });
    editButton.addEventListener('click', () => onEdit(index));
    answer.className = 'review-answer';
    answer.textContent = getAnswerLabel(question, answers[question.id], translate);
    heading.append(number, prompt, editButton);
    item.append(heading, answer);
    return item;
  });

  list.append(...items);
  elements.screenContent.replaceChildren(list);
  elements.surveyNavigation.hidden = false;
  elements.backButton.disabled = false;
  elements.backButton.textContent = translate('backButton');
  elements.nextButton.textContent = translate('submitButton');
  hideValidation(elements);
  focusViewTitle(elements);
}

export function renderCompletion({
  elements,
  config,
  answers,
  duration,
  translate,
  onDownload,
  onRestart
}) {
  elements.viewEyebrow.textContent = translate('completionEyebrow');
  elements.viewTitle.textContent = translate('completionTitle');
  elements.viewDescription.textContent = translate('completionDescription');
  elements.screenContent.className = 'screen-content completion-screen';
  elements.surveyNavigation.hidden = true;

  const completion = document.createElement('div');
  const meta = document.createElement('strong');
  const signalSection = document.createElement('section');
  const signalHeading = document.createElement('h2');
  const signalDescription = document.createElement('p');
  const chartFrame = document.createElement('div');
  const canvas = document.createElement('canvas');
  const actions = document.createElement('div');
  const downloadButton = document.createElement('button');
  const restartButton = document.createElement('button');
  completion.className = 'completion-layout';
  meta.className = 'completion-meta';
  meta.textContent = translate('completedMeta', { count: config.questions.length, duration });
  signalSection.className = 'signal-section';
  signalHeading.textContent = translate('signalTitle');
  signalDescription.textContent = translate('signalDescription');
  chartFrame.className = 'signal-frame';
  canvas.id = 'signal-canvas';
  canvas.width = 760;
  canvas.height = 230;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', translate('signalCanvasLabel'));
  chartFrame.append(canvas);
  signalSection.append(signalHeading, signalDescription, chartFrame);
  actions.className = 'completion-actions';
  downloadButton.type = 'button';
  downloadButton.className = 'primary-button';
  downloadButton.textContent = translate('downloadButton');
  downloadButton.addEventListener('click', onDownload);
  restartButton.type = 'button';
  restartButton.className = 'secondary-button';
  restartButton.textContent = translate('restartButton');
  restartButton.addEventListener('click', onRestart);
  actions.append(downloadButton, restartButton);

  const summary = document.createElement('section');
  const summaryHeading = document.createElement('h2');
  const responseList = document.createElement('dl');
  summary.className = 'response-summary';
  summaryHeading.textContent = translate('responseSummaryTitle');
  responseList.className = 'response-list';

  config.questions.forEach((question, index) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = `${String(index + 1).padStart(2, '0')} · ${translate(question.shortKey)}`;
    description.textContent = getAnswerLabel(question, answers[question.id], translate);
    row.append(term, description);
    responseList.append(row);
  });

  summary.append(summaryHeading, responseList);
  completion.append(meta, signalSection, actions, summary);
  elements.screenContent.replaceChildren(completion);
  hideValidation(elements);
  focusViewTitle(elements);
  return canvas;
}

export function showValidation(elements, message) {
  elements.validationMessage.textContent = message;
  elements.validationMessage.hidden = false;
  elements.validationMessage.focus?.();
}

export function hideValidation(elements) {
  elements.validationMessage.hidden = true;
  elements.validationMessage.textContent = '';
}

export function setPressedState(buttons, activeLanguage) {
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === activeLanguage));
  });
}

export function showToast(container, message, tone = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tone}`;
  toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  container.replaceChildren(toast);

  window.setTimeout(() => {
    toast.classList.add('toast-leaving');
    window.setTimeout(() => toast.remove(), 180);
  }, 3200);
}

export function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function focusViewTitle(elements) {
  const panel = elements.viewTitle.closest('.survey-panel');

  // FR : Chaque nouvel écran commence en haut, même après une longue révision.
  // EN: Every new screen starts at the top, even after a long review.
  if (panel) {
    panel.scrollTop = 0;
  }

  window.scrollTo(0, 0);
  window.requestAnimationFrame(() => elements.viewTitle.focus({ preventScroll: true }));
}
