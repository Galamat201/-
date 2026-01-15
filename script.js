const cells = document.querySelectorAll(".cell");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !isGameActive) return;

  playMove(index, currentPlayer);

  if (isGameActive) {
    setTimeout(() => {
      aiMove();
    }, 300);
  }
}

function playMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  checkWinner(player);
}

function checkWinner(player) {
  let roundWon = false;
  let winningCells = [];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      winningCells = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    message.textContent = `${player} жеңді! 🎉`;
    isGameActive = false;

    winningCells.forEach((i) => {
      cells[i].classList.add("winner");
    });
    return;
  }

  if (!board.includes("")) {
    message.textContent = `Тең нәтиже! 🤝`;
    isGameActive = false;
    return;
  }

  currentPlayer = player === "X" ? "0" : "X";
  message.textContent = `${currentPlayer}-дің кезегі`;
}

// AI қарапайым стратегиясы
function aiMove() {
  if (!isGameActive) return;

  // 1. Жеңуге болатын ұяшық
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "0";
      if (isWinning("0")) {
        playMove(i, "0");
        return;
      }
      board[i] = "";
    }
  }

  // 2. X-тің жеңуін блоктау
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (isWinning("X")) {
        board[i] = "";
        playMove(i, "0");
        return;
      }
      board[i] = "";
    }
  }

  // 3. Бос ұяшыққа кездейсоқ қою
  let emptyCells = board
    .map((v, idx) => (v === "" ? idx : null))
    .filter((v) => v !== null);
  let randIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  playMove(randIndex, "0");
}

function isWinning(player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
  message.textContent = `${currentPlayer}-дің кезегі`;
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);

message.textContent = `${currentPlayer}-дің кезегі`;
