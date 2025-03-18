// Global variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;
let userAnswers = [];

// DOM Elements
const pagePath = window.location.pathname;

// Initialize the application based on the current page
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = pagePath.split("/").pop();

  if (currentPage === "quiz.html" || currentPage === "") {
    initQuiz();
  } else if (currentPage === "results.html") {
    displayResults();
  }
});

// Quiz Page Functions
function initQuiz() {
  if (!document.getElementById("quiz-container")) return;

  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = Array(quizQuestions.length).fill(null);

  // Display the first question
  displayQuestion();

  // Add event listeners
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
  document.getElementById("prev-btn").addEventListener("click", prevQuestion);
}

function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = quizQuestions.length;

  // Update question number and progress bar
  document.getElementById(
    "question-number"
  ).textContent = `Question ${questionNumber} of ${totalQuestions}`;
  const progressPercentage = (questionNumber / totalQuestions) * 100;
  document.getElementById(
    "progress-bar"
  ).style.width = `${progressPercentage}%`;
  document.getElementById("progress-bar").textContent = `${Math.round(
    progressPercentage
  )}%`;
  document
    .getElementById("progress-bar")
    .setAttribute("aria-valuenow", progressPercentage);

  // Display question text
  document.getElementById("question-text").textContent = question.question;

  // Create options
  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionButton = document.createElement("button");
    optionButton.className = "option-btn";
    optionButton.textContent = option;
    optionButton.setAttribute("data-index", index);

    // If user has already answered this question, show the selected option
    if (userAnswers[currentQuestionIndex] === index) {
      optionButton.classList.add("selected");
    }

    optionButton.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionButton);
  });

  // Update navigation buttons
  document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
  document.getElementById("next-btn").textContent =
    currentQuestionIndex === quizQuestions.length - 1 ? "Finish" : "Next";

  // Reset and start timer
  resetTimer();
}

function selectOption(event) {
  const selectedIndex = parseInt(event.target.getAttribute("data-index"));
  userAnswers[currentQuestionIndex] = selectedIndex;

  // Update UI to show selected option
  const options = document.querySelectorAll(".option-btn");
  options.forEach((option) => option.classList.remove("selected"));
  event.target.classList.add("selected");

  // If it's the last question and an option is selected, enable the finish button
  if (currentQuestionIndex === quizQuestions.length - 1) {
    // You can add additional logic here if needed
  }
}

function nextQuestion() {
  // Clear timer
  clearInterval(timer);

  // If it's the last question, finish the quiz
  if (currentQuestionIndex === quizQuestions.length - 1) {
    finishQuiz();
    return;
  }

  // Move to the next question
  currentQuestionIndex++;
  displayQuestion();
}

function prevQuestion() {
  // Clear timer
  clearInterval(timer);

  // Move to the previous question
  currentQuestionIndex--;
  displayQuestion();
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  updateTimerDisplay();

  // Start the timer
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      // Auto-advance to next question or finish quiz if time runs out
      if (currentQuestionIndex === quizQuestions.length - 1) {
        finishQuiz();
      } else {
        nextQuestion();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  // Change color based on time left
  if (timeLeft <= 5) {
    timerDisplay.className = "badge bg-danger text-white p-2";
  } else if (timeLeft <= 10) {
    timerDisplay.className = "badge bg-warning text-dark p-2";
  } else {
    timerDisplay.className = "badge bg-primary text-white p-2";
  }
}

function finishQuiz() {
  // Calculate the score
  calculateScore();

  // Save quiz results to local storage
  saveQuizResults();

  // Redirect to results page
  window.location.href = "results.html";
}

function calculateScore() {
  score = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correctAnswer) {
      score += 10; // Each correct answer is worth 10 points
    }
  });
}

function saveQuizResults() {
  localStorage.setItem("quizScore", score);
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
}

// Results Page Functions
function displayResults() {
  if (!document.getElementById("score-display")) return;

  // Get quiz results from local storage
  const score = parseInt(localStorage.getItem("quizScore") || "0");
  const userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "[]");
  const totalQuestions = quizQuestions.length;
  const totalPossibleScore = totalQuestions * 10;

  // Display score
  document.getElementById("score").textContent = score;
  document.getElementById("total-score").textContent = totalPossibleScore;

  // Calculate and display percentage
  const percentage = (score / totalPossibleScore) * 100;
  document.getElementById("score-progress").style.width = `${percentage}%`;
  document.getElementById("score-progress").textContent = `${Math.round(
    percentage
  )}%`;
  document
    .getElementById("score-progress")
    .setAttribute("aria-valuenow", percentage);

  // Count correct answers
  let correctCount = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correctAnswer) {
      correctCount++;
    }
  });

  document.getElementById("correct-count").textContent = correctCount;
  document.getElementById("total-questions").textContent = totalQuestions;

  // Display answer review
  displayAnswerReview(userAnswers);

  // Add event listener for saving score
  document
    .getElementById("save-score-btn")
    .addEventListener("click", saveScoreToLeaderboard);
}

function displayAnswerReview(userAnswers) {
  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  quizQuestions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    const reviewItem = document.createElement("div");
    reviewItem.className = `review-item ${isCorrect ? "correct" : "incorrect"}`;

    const questionHeading = document.createElement("h4");
    questionHeading.textContent = `Question ${index + 1}: ${question.question}`;

    const userAnswerPara = document.createElement("p");
    userAnswerPara.innerHTML = `Your answer: <strong>${
      userAnswer !== null ? question.options[userAnswer] : "No answer"
    }</strong>`;

    const correctAnswerPara = document.createElement("p");
    correctAnswerPara.innerHTML = `Correct answer: <strong>${
      question.options[question.correctAnswer]
    }</strong>`;

    const explanationPara = document.createElement("p");
    explanationPara.innerHTML = `<em>${question.explanation}</em>`;

    reviewItem.appendChild(questionHeading);
    reviewItem.appendChild(userAnswerPara);
    reviewItem.appendChild(correctAnswerPara);
    reviewItem.appendChild(explanationPara);

    answersContainer.appendChild(reviewItem);
  });
}

function saveScoreToLeaderboard() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name to save your score.");
    return;
  }

  const score = parseInt(localStorage.getItem("quizScore") || "0");
  const date = new Date().toLocaleDateString();

  // Get existing leaderboard data
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  // Add new score
  leaderboard.push({ username, score, date });

  // Sort leaderboard by score (highest first)
  leaderboard.sort((a, b) => b.score - a.score);

  // Keep only top 10 scores
  leaderboard = leaderboard.slice(0, 10);

  // Save back to local storage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  // Show confirmation and redirect
  alert("Your score has been saved to the leaderboard!");
  window.location.href = "leaderboard.html";
}
