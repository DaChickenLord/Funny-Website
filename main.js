const WORD_LENGTH = 7;
const MAX_ATTEMPTS = 6;

function generateTargetNumber() {
  const min = 10 ** (WORD_LENGTH - 1);
  const max = 10 ** WORD_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
const targetNumber = generateTargetNumber();

let currentGuess = "";
let currentRow = 0;

function createBoard() {
  const board = document.getElementById("board");
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < WORD_LENGTH; j++) {
      const box = document.createElement("div");
      box.classList.add("box");
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}

function updateBoard() {
  const row = document.getElementsByClassName("row")[currentRow];
  const boxes = row.getElementsByClassName("box");
  for (let i = 0; i < WORD_LENGTH; i++) {
    boxes[i].textContent = currentGuess[i] || "";
  }
}

function handleKey(key) {
  if (currentRow >= MAX_ATTEMPTS) return;

  if (key === "enter") {
    if (currentGuess.length !== WORD_LENGTH) return;
  
    const row = document.getElementsByClassName("row")[currentRow];
    const boxes = row.getElementsByClassName("box");
  
    const targetChars = targetNumber.split("");
    const guessChars = currentGuess.split("");
  
    const result = Array(WORD_LENGTH).fill("absent");
  
    // First pass: mark correct (green)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] === targetChars[i]) {
        result[i] = "correct";
        targetChars[i] = null; // mark as used
      }
    }
  
    // Second pass: mark present (yellow)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === "correct") continue;
      const index = targetChars.indexOf(guessChars[i]);
      if (index !== -1) {
        result[i] = "present";
        targetChars[index] = null; // mark as used
      }
    }
  
    for (let i = 0; i < WORD_LENGTH; i++) {
      boxes[i].classList.add(result[i]);
      const keyButton = document.querySelector(`button[data-key="${guessChars[i]}"]`);
      updateKeyColor(keyButton, result[i]);
    }
  
    if (currentGuess === targetNumber) {
      setTimeout(() => alert("🎉 You guessed it!"), 100);
      return;
    }
  
    currentGuess = "";
    currentRow++;
  
    if (currentRow >= MAX_ATTEMPTS) {
      setTimeout(() => alert(`💀 Out of tries! Number was: ${targetNumber}`), 100);
    }
  
    return;
  }

  if (key === "del" || key === "backspace") {
    currentGuess = currentGuess.slice(0, -1);
  } else if (/^[0-9]$/.test(key) && currentGuess.length < WORD_LENGTH) {
    currentGuess += key;
  }

  updateBoard();
}

function setupKeyboard() {
  document.querySelectorAll("button[data-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-key").toLowerCase();
      handleKey(key);
    });
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === "enter" || key === "backspace" || /^[0-9]$/.test(key)) {
      handleKey(key);
    }
  });
}

function updateKeyColor(button, status) {
    const statusPriority = { correct: 3, present: 2, absent: 1 };
    const currentStatus = button.dataset.status;
  
    if (
      !currentStatus ||
      statusPriority[status] > statusPriority[currentStatus]
    ) {
      button.classList.remove("correct", "present", "absent");
      button.classList.add(status);
      button.dataset.status = status;
    }
  }
  

window.addEventListener("DOMContentLoaded", () => {
  createBoard();
  setupKeyboard();
});
