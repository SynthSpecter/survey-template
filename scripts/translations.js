/*
 * FR : Toutes les phrases de l'interface et du questionnaire sont centralisées ici.
 * EN: Every interface and survey sentence is centralized here.
 */

const translations = {
  fr: {
    documentTitle: 'Synth Survey — Questionnaire local',
    skipToContent: 'Aller au questionnaire',
    brandTagline: 'Questionnaire local',
    localDraftStatus: 'Brouillon local',
    languageLabel: 'Langue de l’interface',
    toggleTheme: 'Changer de thème',
    demoSurveyEyebrow: 'QUESTIONNAIRE DÉMO',
    surveyTitle: 'Impulsion créative',
    surveyDescription: 'Un instantané de votre manière de créer et de collaborer.',
    progressLabel: 'Progression',
    stepsLabel: 'Étapes du questionnaire',
    sessionTitle: 'Cette session',
    draftEmpty: 'Aucun brouillon enregistré',
    draftSaved: 'Enregistré localement à {time}',
    resetDraftButton: 'Effacer le brouillon',
    privacyTitle: 'Réponses privées',
    privacyText: 'Elles restent dans ce navigateur jusqu’à la validation.',
    questionEyebrow: 'QUESTION {current} SUR {total}',
    requiredLabel: 'Réponse requise',
    backButton: 'Précédent',
    nextButton: 'Suivant',
    reviewButton: 'Réviser',
    submitButton: 'Valider les réponses',
    reviewEyebrow: 'AVANT VALIDATION',
    reviewTitle: 'Réviser vos réponses',
    reviewDescription: 'Vérifiez chaque réponse avant de terminer la session.',
    editAnswer: 'Modifier la réponse {number}',
    completionEyebrow: 'SIGNAL REÇU',
    completionTitle: 'Merci pour votre participation',
    completionDescription: 'Vos réponses ont été validées et le brouillon local a été effacé.',
    signalTitle: 'Empreinte de réponse',
    signalDescription: 'Une signature visuelle déterministe créée à partir de cette session.',
    signalCanvasLabel: 'Empreinte visuelle calculée à partir des réponses',
    responseSummaryTitle: 'Résumé des réponses',
    downloadButton: 'Télécharger le JSON',
    restartButton: 'Nouvelle session',
    completedMeta: '{count} réponses · {duration}',
    resetEyebrow: 'NOUVELLE SESSION',
    resetDialogTitle: 'Effacer le brouillon ?',
    resetDialogText: 'Toutes les réponses de cette session seront supprimées de ce navigateur.',
    cancelButton: 'Annuler',
    confirmResetButton: 'Effacer',
    draftRestoredToast: 'Brouillon local restauré.',
    draftResetToast: 'Nouvelle session prête.',
    exportToast: 'Export JSON préparé.',
    validationSingle: 'Choisissez une réponse pour continuer.',
    validationCheckboxMin: 'Choisissez au moins {min} réponse(s).',
    validationCheckboxMax: 'Choisissez au maximum {max} réponse(s).',
    validationTextMin: 'Écrivez au moins {min} caractères.',
    validationScale: 'Choisissez une valeur sur l’échelle.',
    selectedCount: '{count} sur {max} maximum',
    characterCount: '{count} / {max}',
    typeSingle: 'Choix unique',
    typeCheckbox: 'Choix multiples',
    typeText: 'Réponse libre',
    typeScale: 'Échelle',
    stepRole: 'Votre rôle',
    stepPriorities: 'Vos priorités',
    stepExploration: 'Votre curiosité',
    stepWorkflow: 'Votre rythme',
    stepIdea: 'Votre prochaine idée',
    stepRecommend: 'Votre ressenti',
    questionRole: 'Où contribuez-vous le plus souvent ?',
    questionRoleDescription: 'Choisissez le rôle qui ressemble le mieux à votre activité actuelle.',
    optionRoleCode: 'Développement',
    optionRoleDesign: 'Design',
    optionRoleProduct: 'Produit',
    optionRoleLearning: 'Exploration et apprentissage',
    questionPriorities: 'Quelles qualités comptez-vous protéger en priorité ?',
    questionPrioritiesDescription: 'Sélectionnez jusqu’à trois réponses.',
    optionPriorityAccessibility: 'Accessibilité',
    optionPriorityPerformance: 'Performance',
    optionPriorityPrivacy: 'Vie privée',
    optionPriorityDelight: 'Plaisir d’utilisation',
    optionPrioritySimplicity: 'Simplicité',
    questionExploration: 'À quelle fréquence essayez-vous un nouvel outil ou une nouvelle technique ?',
    questionExplorationDescription: 'Une estimation instinctive suffit.',
    scaleRarely: 'Rarement',
    scaleOften: 'Très souvent',
    questionWorkflow: 'Dans quel rythme créatif êtes-vous le plus à l’aise ?',
    questionWorkflowDescription: 'Il n’y a pas de mauvaise réponse.',
    optionWorkflowSolo: 'Concentration en solo',
    optionWorkflowPair: 'Échange en binôme',
    optionWorkflowTeam: 'Énergie d’équipe',
    optionWorkflowFlexible: 'Un mélange selon le projet',
    questionIdea: 'Qu’aimeriez-vous le plus construire ensuite ?',
    questionIdeaDescription: 'Une idée courte, concrète ou complètement expérimentale.',
    ideaPlaceholder: 'Décrivez votre prochaine idée…',
    questionRecommend: 'À quel point recommanderiez-vous une session de création numérique ?',
    questionRecommendDescription: '0 signifie « pas du tout », 10 « sans hésiter ».',
    scaleNotLikely: 'Pas du tout',
    scaleVeryLikely: 'Sans hésiter'
  },
  en: {
    documentTitle: 'Synth Survey — Local questionnaire',
    skipToContent: 'Skip to the survey',
    brandTagline: 'Local questionnaire',
    localDraftStatus: 'Local draft',
    languageLabel: 'Interface language',
    toggleTheme: 'Switch theme',
    demoSurveyEyebrow: 'DEMO SURVEY',
    surveyTitle: 'Creative pulse',
    surveyDescription: 'A snapshot of how you like to create and collaborate.',
    progressLabel: 'Progress',
    stepsLabel: 'Survey steps',
    sessionTitle: 'This session',
    draftEmpty: 'No draft saved',
    draftSaved: 'Saved locally at {time}',
    resetDraftButton: 'Clear draft',
    privacyTitle: 'Private responses',
    privacyText: 'They stay in this browser until submission.',
    questionEyebrow: 'QUESTION {current} OF {total}',
    requiredLabel: 'Answer required',
    backButton: 'Previous',
    nextButton: 'Next',
    reviewButton: 'Review',
    submitButton: 'Submit responses',
    reviewEyebrow: 'BEFORE SUBMISSION',
    reviewTitle: 'Review your responses',
    reviewDescription: 'Check every answer before completing the session.',
    editAnswer: 'Edit response {number}',
    completionEyebrow: 'SIGNAL RECEIVED',
    completionTitle: 'Thank you for taking part',
    completionDescription: 'Your responses were submitted and the local draft was cleared.',
    signalTitle: 'Response fingerprint',
    signalDescription: 'A deterministic visual signature created from this session.',
    signalCanvasLabel: 'Visual fingerprint calculated from the responses',
    responseSummaryTitle: 'Response summary',
    downloadButton: 'Download JSON',
    restartButton: 'New session',
    completedMeta: '{count} responses · {duration}',
    resetEyebrow: 'NEW SESSION',
    resetDialogTitle: 'Clear the draft?',
    resetDialogText: 'Every response in this session will be removed from this browser.',
    cancelButton: 'Cancel',
    confirmResetButton: 'Clear',
    draftRestoredToast: 'Local draft restored.',
    draftResetToast: 'New session ready.',
    exportToast: 'JSON export prepared.',
    validationSingle: 'Choose one response to continue.',
    validationCheckboxMin: 'Choose at least {min} response(s).',
    validationCheckboxMax: 'Choose no more than {max} response(s).',
    validationTextMin: 'Write at least {min} characters.',
    validationScale: 'Choose a value on the scale.',
    selectedCount: '{count} of {max} maximum',
    characterCount: '{count} / {max}',
    typeSingle: 'Single choice',
    typeCheckbox: 'Multiple choice',
    typeText: 'Free response',
    typeScale: 'Scale',
    stepRole: 'Your role',
    stepPriorities: 'Your priorities',
    stepExploration: 'Your curiosity',
    stepWorkflow: 'Your rhythm',
    stepIdea: 'Your next idea',
    stepRecommend: 'Your feeling',
    questionRole: 'Where do you contribute most often?',
    questionRoleDescription: 'Choose the role that best resembles your current activity.',
    optionRoleCode: 'Development',
    optionRoleDesign: 'Design',
    optionRoleProduct: 'Product',
    optionRoleLearning: 'Exploration and learning',
    questionPriorities: 'Which qualities do you want to protect first?',
    questionPrioritiesDescription: 'Select up to three responses.',
    optionPriorityAccessibility: 'Accessibility',
    optionPriorityPerformance: 'Performance',
    optionPriorityPrivacy: 'Privacy',
    optionPriorityDelight: 'Delight',
    optionPrioritySimplicity: 'Simplicity',
    questionExploration: 'How often do you try a new tool or technique?',
    questionExplorationDescription: 'An instinctive estimate is enough.',
    scaleRarely: 'Rarely',
    scaleOften: 'Very often',
    questionWorkflow: 'Which creative rhythm feels most comfortable?',
    questionWorkflowDescription: 'There is no wrong response.',
    optionWorkflowSolo: 'Focused solo work',
    optionWorkflowPair: 'A pair exchange',
    optionWorkflowTeam: 'Team energy',
    optionWorkflowFlexible: 'A mix depending on the project',
    questionIdea: 'What would you most like to build next?',
    questionIdeaDescription: 'A short, practical, or completely experimental idea.',
    ideaPlaceholder: 'Describe your next idea…',
    questionRecommend: 'How likely are you to recommend a digital creation session?',
    questionRecommendDescription: '0 means “not at all”, 10 “without hesitation”.',
    scaleNotLikely: 'Not at all',
    scaleVeryLikely: 'Without hesitation'
  }
};

let currentLanguage = document.documentElement.lang === 'en' ? 'en' : 'fr';

// FR : Les paramètres entre accolades rendent également les messages dynamiques traduisibles.
// EN: Braced parameters make dynamic messages translatable as well.
export function t(key, parameters = {}) {
  const template = translations[currentLanguage][key] ?? translations.fr[key] ?? key;

  return Object.entries(parameters).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, String(value)),
    template
  );
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'fr';
  document.documentElement.lang = currentLanguage;
  document.title = t('documentTitle');

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    element.setAttribute('title', t(element.dataset.i18nTitle));
  });
}

export function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(currentLanguage, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (currentLanguage === 'fr') {
    return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
  }

  return minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} sec`;
}
