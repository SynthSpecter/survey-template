/*
 * FR : Ce module crée les contrôles natifs et valide les réponses sans dépendre de l'interface.
 * EN: This module creates native controls and validates answers without depending on the interface.
 */

export const QUESTION_TYPES = Object.freeze({
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  CHECKBOX: 'CHECKBOX',
  TEXT: 'TEXT',
  SCALE: 'SCALE'
});

export function validateAnswer(question, answer) {
  if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
    const allowedValues = new Set(question.options.map((option) => option.value));
    return allowedValues.has(answer)
      ? { valid: true }
      : { valid: false, errorKey: 'validationSingle' };
  }

  if (question.type === QUESTION_TYPES.CHECKBOX) {
    const allowedValues = new Set(question.options.map((option) => option.value));
    const values = Array.isArray(answer) ? [...new Set(answer)].filter((value) => allowedValues.has(value)) : [];

    if (values.length < question.minimum) {
      return { valid: false, errorKey: 'validationCheckboxMin', parameters: { min: question.minimum } };
    }

    if (values.length > question.maximum) {
      return { valid: false, errorKey: 'validationCheckboxMax', parameters: { max: question.maximum } };
    }

    return { valid: true };
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    const length = typeof answer === 'string' ? answer.trim().length : 0;
    return length >= question.minimumLength
      ? { valid: true }
      : { valid: false, errorKey: 'validationTextMin', parameters: { min: question.minimumLength } };
  }

  if (question.type === QUESTION_TYPES.SCALE) {
    const number = Number(answer);
    const valid = Number.isInteger(number) && number >= question.minimum && number <= question.maximum;
    return valid ? { valid: true } : { valid: false, errorKey: 'validationScale' };
  }

  return { valid: false, errorKey: 'validationSingle' };
}

export function normalizeAnswer(question, answer) {
  if (question.type === QUESTION_TYPES.CHECKBOX) {
    const allowedValues = new Set(question.options.map((option) => option.value));
    return Array.isArray(answer)
      ? [...new Set(answer)].filter((value) => allowedValues.has(value)).slice(0, question.maximum)
      : [];
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    return typeof answer === 'string' ? answer.slice(0, question.maximumLength) : '';
  }

  if (question.type === QUESTION_TYPES.SCALE) {
    const number = Number(answer);
    return Number.isInteger(number) && number >= question.minimum && number <= question.maximum ? number : null;
  }

  const allowedValues = new Set(question.options.map((option) => option.value));
  return allowedValues.has(answer) ? answer : null;
}

export function isAnswerPresent(question, answer) {
  return validateAnswer(question, answer).valid;
}

export function createQuestionControl({ question, answer, translate, onAnswer }) {
  if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
    return createSingleChoice(question, answer, translate, onAnswer);
  }

  if (question.type === QUESTION_TYPES.CHECKBOX) {
    return createCheckboxChoice(question, answer, translate, onAnswer);
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    return createTextControl(question, answer, translate, onAnswer);
  }

  return createScaleControl(question, answer, translate, onAnswer);
}

function createSingleChoice(question, answer, translate, onAnswer) {
  const list = document.createElement('div');
  list.className = 'option-list';

  question.options.forEach((option) => {
    const { label, input } = createChoiceCard(question, option, 'radio', translate);
    input.checked = answer === option.value;
    input.addEventListener('change', () => onAnswer(option.value));
    list.append(label);
  });

  return list;
}

function createCheckboxChoice(question, answer, translate, onAnswer) {
  const wrapper = document.createElement('div');
  const list = document.createElement('div');
  const helper = document.createElement('p');
  const selectedValues = new Set(normalizeAnswer(question, answer));
  const inputs = [];
  const helperId = `${question.id}-selection-count`;
  wrapper.className = 'control-stack';
  list.className = 'option-list option-list-compact';
  helper.className = 'control-helper';
  helper.id = helperId;

  const synchronizeLimit = () => {
    helper.textContent = translate('selectedCount', {
      count: selectedValues.size,
      max: question.maximum
    });

    inputs.forEach((input) => {
      input.disabled = !input.checked && selectedValues.size >= question.maximum;
    });
  };

  question.options.forEach((option) => {
    const { label, input } = createChoiceCard(question, option, 'checkbox', translate);
    input.checked = selectedValues.has(option.value);
    input.setAttribute('aria-describedby', helperId);
    input.addEventListener('change', () => {
      if (input.checked) {
        selectedValues.add(option.value);
      } else {
        selectedValues.delete(option.value);
      }

      synchronizeLimit();
      onAnswer([...selectedValues]);
    });
    inputs.push(input);
    list.append(label);
  });

  synchronizeLimit();
  wrapper.append(list, helper);
  return wrapper;
}

function createChoiceCard(question, option, inputType, translate) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const indicator = document.createElement('span');
  const copy = document.createElement('span');
  const inputId = `${question.id}-${option.value}`;
  label.className = `option-card accent-${option.accent ?? 'cyan'}`;
  label.setAttribute('for', inputId);
  input.className = 'choice-input';
  input.type = inputType;
  input.id = inputId;
  input.name = question.id;
  input.value = option.value;
  indicator.className = 'choice-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  copy.className = 'option-copy';
  copy.textContent = translate(option.labelKey);
  label.append(input, indicator, copy);
  return { label, input };
}

function createTextControl(question, answer, translate, onAnswer) {
  const wrapper = document.createElement('div');
  const textarea = document.createElement('textarea');
  const counter = document.createElement('span');
  const counterId = `${question.id}-character-count`;
  wrapper.className = 'text-control';
  textarea.id = question.id;
  textarea.name = question.id;
  textarea.rows = 6;
  textarea.maxLength = question.maximumLength;
  textarea.placeholder = translate(question.placeholderKey);
  textarea.value = normalizeAnswer(question, answer);
  textarea.setAttribute('aria-describedby', `view-description ${counterId}`);
  counter.className = 'character-counter';
  counter.id = counterId;

  const updateCounter = () => {
    counter.textContent = translate('characterCount', {
      count: textarea.value.length,
      max: question.maximumLength
    });
  };

  textarea.addEventListener('input', () => {
    updateCounter();
    onAnswer(textarea.value);
  });
  updateCounter();
  wrapper.append(textarea, counter);
  return wrapper;
}

function createScaleControl(question, answer, translate, onAnswer) {
  const wrapper = document.createElement('div');
  const scroller = document.createElement('div');
  const grid = document.createElement('div');
  const endpoints = document.createElement('div');
  const stepCount = question.maximum - question.minimum + 1;
  wrapper.className = 'scale-control';
  scroller.className = 'scale-scroller';
  grid.className = 'scale-grid';
  grid.style.setProperty('--scale-steps', stepCount);
  endpoints.className = 'scale-endpoints';

  for (let value = question.minimum; value <= question.maximum; value += 1) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const visibleValue = document.createElement('span');
    const inputId = `${question.id}-${value}`;
    label.className = 'scale-option';
    label.setAttribute('for', inputId);
    input.className = 'choice-input';
    input.type = 'radio';
    input.id = inputId;
    input.name = question.id;
    input.value = String(value);
    input.setAttribute('aria-label', String(value));
    input.checked = answer === value;
    input.addEventListener('change', () => onAnswer(value));
    visibleValue.textContent = String(value);
    visibleValue.setAttribute('aria-hidden', 'true');
    label.append(input, visibleValue);
    grid.append(label);
  }

  const minimumLabel = document.createElement('span');
  const maximumLabel = document.createElement('span');
  minimumLabel.textContent = translate(question.minimumLabelKey);
  maximumLabel.textContent = translate(question.maximumLabelKey);
  endpoints.append(minimumLabel, maximumLabel);
  scroller.append(grid);
  wrapper.append(scroller, endpoints);
  return wrapper;
}

export function getAnswerLabel(question, answer, translate) {
  if (question.type === QUESTION_TYPES.SINGLE_CHOICE) {
    const option = question.options.find((candidate) => candidate.value === answer);
    return option ? translate(option.labelKey) : '—';
  }

  if (question.type === QUESTION_TYPES.CHECKBOX) {
    const values = normalizeAnswer(question, answer);
    return values
      .map((value) => question.options.find((option) => option.value === value))
      .filter(Boolean)
      .map((option) => translate(option.labelKey))
      .join(', ') || '—';
  }

  if (question.type === QUESTION_TYPES.TEXT) {
    return normalizeAnswer(question, answer).trim() || '—';
  }

  return answer === null || answer === undefined ? '—' : `${answer} / ${question.maximum}`;
}

export function getQuestionTypeKey(question) {
  const keys = {
    [QUESTION_TYPES.SINGLE_CHOICE]: 'typeSingle',
    [QUESTION_TYPES.CHECKBOX]: 'typeCheckbox',
    [QUESTION_TYPES.TEXT]: 'typeText',
    [QUESTION_TYPES.SCALE]: 'typeScale'
  };
  return keys[question.type] ?? 'typeSingle';
}
