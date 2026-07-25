/*
 * FR : Le contenu du questionnaire est séparé du moteur pour rester simple à personnaliser.
 * EN: Survey content is separated from the engine so it remains easy to customize.
 */

export const SURVEY_CONFIG = Object.freeze({
  id: 'creative-pulse',
  version: 2,
  titleKey: 'surveyTitle',
  descriptionKey: 'surveyDescription',
  questions: [
    {
      id: 'role',
      type: 'SINGLE_CHOICE',
      shortKey: 'stepRole',
      textKey: 'questionRole',
      descriptionKey: 'questionRoleDescription',
      required: true,
      options: [
        { value: 'code', labelKey: 'optionRoleCode', accent: 'cyan' },
        { value: 'design', labelKey: 'optionRoleDesign', accent: 'pink' },
        { value: 'product', labelKey: 'optionRoleProduct', accent: 'amber' },
        { value: 'learning', labelKey: 'optionRoleLearning', accent: 'green' }
      ]
    },
    {
      id: 'priorities',
      type: 'CHECKBOX',
      shortKey: 'stepPriorities',
      textKey: 'questionPriorities',
      descriptionKey: 'questionPrioritiesDescription',
      required: true,
      minimum: 1,
      maximum: 3,
      options: [
        { value: 'accessibility', labelKey: 'optionPriorityAccessibility', accent: 'cyan' },
        { value: 'performance', labelKey: 'optionPriorityPerformance', accent: 'amber' },
        { value: 'privacy', labelKey: 'optionPriorityPrivacy', accent: 'green' },
        { value: 'delight', labelKey: 'optionPriorityDelight', accent: 'pink' },
        { value: 'simplicity', labelKey: 'optionPrioritySimplicity', accent: 'violet' }
      ]
    },
    {
      id: 'exploration',
      type: 'SCALE',
      shortKey: 'stepExploration',
      textKey: 'questionExploration',
      descriptionKey: 'questionExplorationDescription',
      required: true,
      minimum: 1,
      maximum: 5,
      minimumLabelKey: 'scaleRarely',
      maximumLabelKey: 'scaleOften'
    },
    {
      id: 'workflow',
      type: 'SINGLE_CHOICE',
      shortKey: 'stepWorkflow',
      textKey: 'questionWorkflow',
      descriptionKey: 'questionWorkflowDescription',
      required: true,
      options: [
        { value: 'solo', labelKey: 'optionWorkflowSolo', accent: 'violet' },
        { value: 'pair', labelKey: 'optionWorkflowPair', accent: 'cyan' },
        { value: 'team', labelKey: 'optionWorkflowTeam', accent: 'pink' },
        { value: 'flexible', labelKey: 'optionWorkflowFlexible', accent: 'green' }
      ]
    },
    {
      id: 'idea',
      type: 'TEXT',
      shortKey: 'stepIdea',
      textKey: 'questionIdea',
      descriptionKey: 'questionIdeaDescription',
      placeholderKey: 'ideaPlaceholder',
      required: true,
      minimumLength: 3,
      maximumLength: 240
    },
    {
      id: 'recommend',
      type: 'SCALE',
      shortKey: 'stepRecommend',
      textKey: 'questionRecommend',
      descriptionKey: 'questionRecommendDescription',
      required: true,
      minimum: 0,
      maximum: 10,
      minimumLabelKey: 'scaleNotLikely',
      maximumLabelKey: 'scaleVeryLikely'
    }
  ]
});
