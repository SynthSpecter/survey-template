// Définition des types de questions disponibles
const QuestionTypes = {
  // Question à choix multiple (1 réponse)
  MULTIPLE_CHOICE: {
    render: (questionData) => {
      const questionId = `q${questionData.id}`
      let html = `
                <div class="question">
                    <h2>Question ${questionData.id}/${questionData.totalQuestions}</h2>
                    <p>${questionData.text}</p>
                    <div class="options">
            `

      questionData.options.forEach((option, index) => {
        html += `
                    <div class="option">
                        <input type="radio" name="${questionId}" id="${questionId}-option${index}" value="${option}">
                        <label for="${questionId}-option${index}">${option}</label>
                    </div>
                `
      })

      html += `
                    </div>
                </div>
            `
      return html
    },
    isAnswered: (questionId) => {
      return (
        document.querySelector(`input[name="${questionId}"]:checked`) !== null
      )
    },
    getAnswer: (questionId) => {
      const selected = document.querySelector(
        `input[name="${questionId}"]:checked`,
      )
      return selected ? selected.value : null
    },
  },

  // Question à cases à cocher (réponses multiples)
  CHECKBOX: {
    render: (questionData) => {
      const questionId = `q${questionData.id}`
      let html = `
                <div class="question">
                    <h2>Question ${questionData.id}/${questionData.totalQuestions}</h2>
                    <p>${questionData.text}</p>
                    <div class="options">
            `

      questionData.options.forEach((option, index) => {
        html += `
                    <div class="option">
                        <input type="checkbox" name="${questionId}" id="${questionId}-option${index}" value="${option}">
                        <label for="${questionId}-option${index}">${option}</label>
                    </div>
                `
      })

      html += `
                    </div>
                </div>
            `
      return html
    },
    isAnswered: (questionId) => {
      return (
        document.querySelectorAll(`input[name="${questionId}"]:checked`)
          .length > 0
      )
    },
    getAnswer: (questionId) => {
      const selected = document.querySelectorAll(
        `input[name="${questionId}"]:checked`,
      )
      return Array.from(selected).map((el) => el.value)
    },
  },

  // Question ouverte (champ texte)
  TEXT: {
    render: (questionData) => {
      const questionId = `q${questionData.id}`
      return `
                <div class="question">
                    <h2>Question ${questionData.id}/${questionData.totalQuestions}</h2>
                    <p>${questionData.text}</p>
                    <textarea class="text-input" name="${questionId}" placeholder="Ta réponse..."></textarea>
                </div>
            `
    },
    isAnswered: (questionId) => {
      const input = document.querySelector(`textarea[name="${questionId}"]`)
      return input && input.value.trim() !== ''
    },
    getAnswer: (questionId) => {
      const input = document.querySelector(`textarea[name="${questionId}"]`)
      return input ? input.value : null
    },
  },

  // Question à échelle (ex: 1-5)
  SCALE: {
    render: (questionData) => {
      const questionId = `q${questionData.id}`
      let html = `
                <div class="question">
                    <h2>Question ${questionData.id}/${questionData.totalQuestions}</h2>
                    <p>${questionData.text}</p>
                    <div class="scale-container">
            `

      for (let i = questionData.min; i <= questionData.max; i++) {
        html += `
                    <div class="scale-option">
                        <input type="radio" name="${questionId}" id="${questionId}-scale${i}" value="${i}">
                        <label for="${questionId}-scale${i}">${i}</label>
                    </div>
                `
      }

      html += `
                    </div>
                </div>
            `
      return html
    },
    isAnswered: (questionId) => {
      return (
        document.querySelector(`input[name="${questionId}"]:checked`) !== null
      )
    },
    getAnswer: (questionId) => {
      const selected = document.querySelector(
        `input[name="${questionId}"]:checked`,
      )
      return selected ? parseInt(selected.value) : null
    },
  },
}
