const ROWS = 6;
const COLS = 7;
let currentPlayer = "red";
let gameBoard = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(null));
let gameActive = true;

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.className = `cell ${gameBoard[row][col] || ""} ${
        gameActive && currentPlayer === "red" ? "hover-red" : ""
      }`;
      cell.dataset.col = col;
      cell.onclick = () => makeMove(col);
      board.appendChild(cell);
    }
  }
}

function findLowestEmptyRow(col) {
  let row = ROWS - 1;
  while (row >= 0 && gameBoard[row][col] !== null) {
    row--;
  }
  return row;
}

function makeMove(col) {
  if (!gameActive || currentPlayer !== "red") return;

  const row = findLowestEmptyRow(col);

  if (row >= 0) {
    gameBoard[row][col] = currentPlayer;

    if (checkWin(row, col)) {
      document.querySelector(".status").textContent = `You Win!`;
      gameActive = false;
    } else if (checkDraw()) {
      document.querySelector(".status").textContent = "It's a Draw!";
      gameActive = false;
    } else {
      currentPlayer = "yellow";
      document.querySelector(".status").textContent = "AI is thinking...";
      createBoard();
      setTimeout(makeAIMove, 500);
    }

    createBoard();
  }
}

function makeAIMove() {
  if (!gameActive) return;

  const move = findBestMove();
  const row = findLowestEmptyRow(move);

  if (row >= 0) {
    gameBoard[row][move] = "yellow";

    if (checkWin(row, move)) {
      document.querySelector(".status").textContent = `AI Wins!`;
      gameActive = false;
    } else if (checkDraw()) {
      document.querySelector(".status").textContent = "It's a Draw!";
      gameActive = false;
    } else {
      currentPlayer = "red";
      document.querySelector(".status").textContent = "Your Turn (Red)";
    }

    createBoard();
  }
}

function findBestMove() {
  for (let col = 0; col < COLS; col++) {
    const row = findLowestEmptyRow(col);
    if (row >= 0) {
      gameBoard[row][col] = "yellow";
      if (checkWin(row, col)) {
        gameBoard[row][col] = null;
        return col;
      }
      gameBoard[row][col] = null;
    }
  }

  for (let col = 0; col < COLS; col++) {
    const row = findLowestEmptyRow(col);
    if (row >= 0) {
      gameBoard[row][col] = "red";
      if (checkWin(row, col)) {
        gameBoard[row][col] = null;
        return col;
      }
      gameBoard[row][col] = null;
    }
  }

  // Prefer center column
  const centerCol = 3;
  if (findLowestEmptyRow(centerCol) >= 0) {
    return centerCol;
  }

  // Try to build from existing pieces
  const validMoves = [];
  for (let col = 0; col < COLS; col++) {
    if (findLowestEmptyRow(col) >= 0) {
      validMoves.push(col);
    }
  }

  // Randomly choose from valid moves
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function checkWin(row, col) {
  const directions = [
    [
      [0, 1],
      [0, -1],
    ], // horizontal
    [
      [1, 0],
      [-1, 0],
    ], // vertical
    [
      [1, 1],
      [-1, -1],
    ], // diagonal /
    [
      [1, -1],
      [-1, 1],
    ], // diagonal \
  ];

  return directions.some((direction) => {
    const count =
      1 + // Count the current piece
      countDirection(row, col, direction[0][0], direction[0][1]) +
      countDirection(row, col, direction[1][0], direction[1][1]);
    return count >= 4;
  });
}

function countDirection(row, col, deltaRow, deltaCol) {
  let count = 0;
  let currentRow = row + deltaRow;
  let currentCol = col + deltaCol;
  const currentColor = gameBoard[row][col];

  while (
    currentRow >= 0 &&
    currentRow < ROWS &&
    currentCol >= 0 &&
    currentCol < COLS &&
    gameBoard[currentRow][currentCol] === currentColor
  ) {
    count++;
    currentRow += deltaRow;
    currentCol += deltaCol;
  }

  return count;
}

function checkDraw() {
  return gameBoard[0].every((cell) => cell !== null);
}

function resetGame() {
  gameBoard = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(null));
  currentPlayer = "red";
  gameActive = true;
  document.querySelector(".status").textContent = "Your Turn (Red)";
  createBoard();
}

createBoard();

function github_open() {
  window.open("https://github.com/PrasanthYT/CF_Game", "_blank");
}
