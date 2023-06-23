// Check if session storage is supported
function isSessionStorageSupported() {
  try {
    return window.sessionStorage !== null;
  } catch (e) {
    return false;
  }
}

// Check if local storage is supported
function isLocalStorageSupported() {
  try {
    return window.localStorage !== null;
  } catch (e) {
    return false;
  }
}

// Retrieve progress from session storage
function retrieveProgress() {
  if (isSessionStorageSupported()) {
    const progress = sessionStorage.getItem('progress');
    if (progress) {
      return JSON.parse(progress);
    }
  }
  return [];
}

// Save progress in session storage
function saveProgress() {
  if (isSessionStorageSupported()) {
    const choices = document.querySelectorAll('input[type="radio"]:checked');
    const progress = Array.from(choices).map((choice) => choice.value);
    sessionStorage.setItem('progress', JSON.stringify(progress));
  }
}

// Retrieve score from local storage
function retrieveScore() {
  if (isLocalStorageSupported()) {
    const score = localStorage.getItem('score');
    if (score) {
      return parseInt(score);
    }
  }
  return 0;
}

// Save score in local storage
function saveScore(score) {
  if (isLocalStorageSupported()) {
    localStorage.setItem('score', score.toString());
  }
}

// Display the quiz questions and choices
// Display the quiz questions and choices
function renderQuestions() {
  const questionsElement = document.getElementById('questions');
  const progress = retrieveProgress();

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const questionElement = document.createElement('div');
    const questionText = document.createTextNode(question.question);
    questionElement.appendChild(questionText);

    for (let j = 0; j < question.choices.length; j++) {
      const choice = question.choices[j];
      const choiceElement = document.createElement('input');
      choiceElement.setAttribute('type', 'radio');
      choiceElement.setAttribute('name', `question-${i}`);
      choiceElement.setAttribute('value', choice);

      if (progress[i] === choice) {
        choiceElement.setAttribute('checked', true);
      }

      choiceElement.addEventListener('change', saveProgress);

      const choiceText = document.createTextNode(choice);
      const choiceLabel = document.createElement('label');
      choiceLabel.appendChild(choiceElement);
      choiceLabel.appendChild(choiceText);

      questionElement.appendChild(choiceLabel);
    }

    questionsElement.appendChild(questionElement);
  }
}

// Calculate the score
function calculateScore() {
  const choices = document.querySelectorAll('input[type="radio"]:checked');
  let score = 0;

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i].value;
    const answer = questions[i].answer;

    if (choice === answer) {
      score++;
    }
  }

  return score;
}

// Display the score
function displayScore() {
  const scoreElement = document.getElementById('score');
  const score = retrieveScore();
  const scoreText = document.createTextNode(`Your score is ${score} out of ${questions.length}.`);
  scoreElement.appendChild(scoreText);
}

// Handle the submit button click event
function handleSubmit() {
  const score = calculateScore();
  saveScore(score);
  displayScore();
}

// Attach event listener to the submit button
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', handleSubmit);

// Render the questions on page load
renderQuestions();
