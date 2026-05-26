// Configuration du questionnaire
const surveyConfig = {
  questions: [
    {
      id: 1,
      type: 'MULTIPLE_CHOICE',
      text: 'Quel est ton style de musique préféré ?',
      options: ['Synthwave', 'Electro', 'Rock', 'Autre'],
    },
    {
      id: 2,
      type: 'CHECKBOX',
      text: 'Quelles couleurs néon aimes-tu ? (Plusieurs réponses possibles)',
      options: [
        'Rose (#FF2CED)',
        'Bleu (#05D9E8)',
        'Violet (#C905C9)',
        'Vert (#00FF9D)',
      ],
    },
    {
      id: 3,
      type: 'TEXT',
      text: 'Quel est ton artiste synthwave préféré ?',
    },
    {
      id: 4,
      type: 'SCALE',
      text: 'À quel point aimes-tu le style rétro ? (1 = Pas du tout, 5 = Beaucoup)',
      min: 1,
      max: 5,
    },
  ],
}

// Variables globales
let currentQuestionIndex = 0
let answers = {}

// Éléments DOM
const surveyContainer = document.getElementById('survey-container')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const endMessage = document.getElementById('end-message')
const progressBar = document.getElementById('progress-bar')
const restartBtn = document.getElementById('restart-btn')

// Initialisation
function init() {
  surveyConfig.questions.forEach((question) => {
    question.totalQuestions = surveyConfig.questions.length
  })
  renderQuestion(currentQuestionIndex)
  updateProgressBar()
  updateButtons()
}

// Rendre une question
function renderQuestion(index) {
  const question = surveyConfig.questions[index]
  const questionType = QuestionTypes[question.type]

  surveyContainer.innerHTML = questionType.render(question)
  surveyContainer.classList.add('question-container', 'active')

  // Ajouter un écouteur pour les changements de réponse
  const inputs = surveyContainer.querySelectorAll('input, textarea')
  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      updateButtons()
      saveAnswer()
    })
    input.addEventListener('input', () => {
      updateButtons()
      saveAnswer()
    })
  })
}

// Sauvegarder la réponse
function saveAnswer() {
  const question = surveyConfig.questions[currentQuestionIndex]
  const questionType = QuestionTypes[question.type]
  const questionId = `q${question.id}`

  answers[questionId] = questionType.getAnswer(questionId)
}

// Mettre à jour la barre de progression
function updateProgressBar() {
  const progress =
    ((currentQuestionIndex + 1) / surveyConfig.questions.length) * 100
  progressBar.style.width = `${progress}%`
}

// Mettre à jour les boutons
function updateButtons() {
  const question = surveyConfig.questions[currentQuestionIndex]
  const questionType = QuestionTypes[question.type]
  const questionId = `q${question.id}`

  prevBtn.disabled = currentQuestionIndex === 0

  const isAnswered = questionType.isAnswered(questionId)

  if (currentQuestionIndex < surveyConfig.questions.length - 1) {
    nextBtn.disabled = !isAnswered
    nextBtn.textContent = 'Suivant'
  } else {
    nextBtn.disabled = !isAnswered
    nextBtn.textContent = 'Terminer'
  }
}

// Passer à la question suivante
function nextQuestion() {
  saveAnswer()
  if (currentQuestionIndex < surveyConfig.questions.length - 1) {
    currentQuestionIndex++
    renderQuestion(currentQuestionIndex)
    updateProgressBar()
    updateButtons()
  } else {
    // Afficher le message de fin
    surveyContainer.classList.remove('active')
    endMessage.style.display = 'block'
    document.querySelector('.navigation').style.display = 'none'
    console.log('Réponses:', answers) // Pour débogage
  }
}

// Revenir à la question précédente
function prevQuestion() {
  saveAnswer()
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--
    renderQuestion(currentQuestionIndex)
    updateProgressBar()
    updateButtons()
  }
}

// Recommencer le questionnaire
function restartSurvey() {
  currentQuestionIndex = 0
  answers = {}
  endMessage.style.display = 'none'
  document.querySelector('.navigation').style.display = 'flex'
  renderQuestion(currentQuestionIndex)
  updateProgressBar()
  updateButtons()
}

// Événements
prevBtn.addEventListener('click', prevQuestion)
nextBtn.addEventListener('click', nextQuestion)
restartBtn.addEventListener('click', restartSurvey)

// Initialiser le questionnaire
init()
