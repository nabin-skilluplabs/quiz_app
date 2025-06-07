import './style.css'
import { quizData } from './data/quiz'


let currentQuestionIndex = 0
let score = 0
let timer = null
let results = []

const app = document.querySelector('#app')
const startScreen = document.createElement('div')
const quizScreen = document.createElement('div')
const resultScreen = document.createElement('div')

// Initialize the app
function init() {
  startScreen.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-4">${quizData.title}</h1>
      <p class="mb-6">${quizData.description}</p>
      <button id="startBtn" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Start Quiz
      </button>
    </div>
  `

  app.appendChild(startScreen)
  document.getElementById('startBtn').addEventListener('click', startQuiz)
}

// Start the quiz
function startQuiz() {
  startScreen.remove()
  showQuestion()
  app.appendChild(quizScreen)
}

// Show current question
function showQuestion() {
  const question = quizData.questions[currentQuestionIndex]
  quizScreen.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div class="mb-4 flex justify-between items-center">
        <span class="text-sm text-gray-500">Question ${currentQuestionIndex + 1} of ${quizData.questions.length}</span>
        <div id="timer" class="text-sm text-gray-500">Time: 60s</div>
      </div>
      <h2 class="text-xl font-semibold mb-4">${question.question}</h2>
      <div class="space-y-2">
        ${question.options.map(option => `
          <button class="w-full text-left p-3 rounded border hover:bg-gray-50" data-option="${option}">
            ${option}
          </button>
        `).join('')}
      </div>
    </div>
  `

  

  // Start timer after the element is added to DOM
  setTimeout(() => {
    // Add click event listeners to options
  document.querySelectorAll('[data-option]').forEach(button => {
    button.addEventListener('click', () => handleAnswer(button))
  })
    startTimer()
  }, 0)
}

// Handle answer selection
function handleAnswer(selectedButton) {
  clearInterval(timer)
  const selectedAnswer = selectedButton.dataset.option
  const correctAnswer = quizData.questions[currentQuestionIndex].correctAnswer
  const isCorrect = selectedAnswer === correctAnswer

  // Update score
  if (isCorrect) {
    score++
  } else {
    score = Math.max(0, score - 1)
  }

  // Store result
  results.push({
    question: quizData.questions[currentQuestionIndex].question,
    selectedAnswer,
    correctAnswer,
    isCorrect
  })

  // Show feedback
  document.querySelectorAll('[data-option]').forEach(button => {
    const option = button.dataset.option
    if (option === correctAnswer) {
      button.classList.add('bg-green-100', 'border-green-500')
    } else if (option === selectedAnswer && !isCorrect) {
      button.classList.add('bg-red-100', 'border-red-500')
    }
    button.disabled = true
  })

  // Move to next question after delay
  setTimeout(() => {
    currentQuestionIndex++
    if (currentQuestionIndex < quizData.questions.length) {
      showQuestion()
    } else {
      showResults()
    }
  }, 1500)
}

// Start timer for current question
function startTimer() {
  let timeLeft = 60
  const timerElement = document.getElementById('timer')
  
  if (!timerElement) {
    console.error('Timer element not found')
    return
  }

  // Clear any existing timer
  if (timer) {
    clearInterval(timer)
  }

  // Update timer display immediately
  updateTimerDisplay(timerElement, timeLeft)
  
  timer = setInterval(() => {
    timeLeft--
    if (timerElement) {
      updateTimerDisplay(timerElement, timeLeft)
    }
    
    if (timeLeft <= 0) {
      clearInterval(timer)
      // Auto-skip to next question
      currentQuestionIndex++
      if (currentQuestionIndex < quizData.questions.length) {
        showQuestion()
      } else {
        showResults()
      }
    }
  }, 1000)
}

// Helper function to update timer display
function updateTimerDisplay(element, timeLeft) {
  if (!element) return
  
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
  
  // Add visual feedback for low time
  if (timeLeft <= 10) {
    element.classList.add('text-red-500', 'font-bold')
  } else {
    element.classList.remove('text-red-500', 'font-bold')
  }
  
  element.textContent = `Time: ${formattedTime}`
}

// Show final results
function showResults() {
  quizScreen.remove()
  resultScreen.innerHTML = `
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p class="text-xl mb-6">Your final score: ${score} out of ${quizData.questions.length}</p>
      <div class="space-y-4">
        ${results.map((result, index) => `
          <div class="p-4 rounded ${result.isCorrect ? 'bg-green-50' : 'bg-red-50'}">
            <p class="font-semibold">Question ${index + 1}: ${result.question}</p>
            <p class="text-sm">Your answer: ${result.selectedAnswer}</p>
            <p class="text-sm">Correct answer: ${result.correctAnswer}</p>
          </div>
        `).join('')}
      </div>
      <button id="restartBtn" class="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Restart Quiz
      </button>
    </div>
  `

  app.appendChild(resultScreen)
  document.getElementById('restartBtn').addEventListener('click', () => {
    currentQuestionIndex = 0
    score = 0
    results = []
    resultScreen.remove()
    startQuiz()
  })
}

// Initialize the app
init()
