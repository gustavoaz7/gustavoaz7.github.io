const winningPlay = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const selection = document.querySelector('#selection');
const gameover = document.querySelector('#gameOver');
const boxes = document.querySelector('#boxes');
let human = 'X', bot = 'O';
let botMove;
let gameboard = new Array(9).fill(0);
let turn = 0;
let [tieGames, botWins, userWins] = [0, 0, 0];


selectMarker();

// Display marker options and start game when one is selected
function selectMarker() {
  boxes.style.display = 'block';
  selection.classList = 'animated flipInX';
  document.querySelectorAll('#select>span').forEach(marker => {
    marker.addEventListener('click', () => {
      human = marker.textContent;
      bot = (human === 'X' ? 'O' : 'X');
      selection.classList = 'animated flipOutX';
      setTimeout(() => {
        boxes.style.display = 'none';
        selection.style.display = "none";
      }, 600); 
      newGame()
    })
  });
}

function newGame() {
  gameboard = new Array(9).fill(0);
  document.querySelectorAll('#board>span').forEach((cell, i) => {
    cell.addEventListener('click', humanTurn);
    !gameboard[i] ? cell.textContent = '' : cell.textContent = gameboard[i];
  })
  turn = 0;
}

function humanTurn(e) {
  if (!gameboard[e.target.id]) {
    [gameboard[e.target.id], e.target.textContent] = [human, human];
    turn++;
    if (!isOver(gameboard, human)) botTurn();
  }
}

function botTurn() {
  minimax(gameboard, bot);
  //console.log(botMove);
  [gameboard[botMove], document.getElementById(botMove).textContent] = [bot, bot];
  turn++;
  isOver(gameboard,bot);
}

// Array of available spots' indexes.
function availableSpots(board) {
  return board.map((cell, i) => !cell ? i : null).filter(x => x != null);
}

// When there is a winner/tie - Display box with result
function isOver(board, player) {
  let winner = isWin(board, player);
  if (winner || turn >= 9) {
    if (winner && player === bot) {
      gameover.firstElementChild.textContent = 'YOU LOST!';
      botWins++;
    } else if (winner && player === human) {
      gameover.firstElementChild.textContent = 'YOU WON!';
      userWins++;
    } else if (turn >= 9) {
      gameover.firstElementChild.textContent = "IT'S A TIE!";
      tieGames++;
    }
    updateScore();
    document.querySelectorAll('#board>span').forEach((cell, i) => {
      cell.removeEventListener('click', humanTurn);
    });
    boxes.style.display = 'block';
    gameover.style.display = 'block';
    gameover.classList = 'animated flipInX';
    gameover.lastElementChild.addEventListener('click', () => {
      gameover.classList = 'animated flipOutX';
      setTimeout(() => {
        boxes.style.display = 'none';
      }, 600); 
      newGame()
    })
    return true
  };
  return false
};

function updateScore() {
  let scores = [tieGames, botWins, userWins];
  ['tieGame', 'botWin', 'userWin'].forEach((x, i) => {
    document.querySelector(`#${x}`).textContent = `${scores[i]}  `;
  })
}

function isWin(board, player) {
  // Store played indexes of current player.
  let plays = board.map((cell, i) => cell === player ? i : null).filter(x => x != null);
  return winningPlay.some(win => win.every(w => plays.includes(w)))
}


function minimax(board, player) {
  // Checking for terminal states.
  if (isWin(board, human)) {
    return -10
  } else if (isWin(board, bot)) {
    return 10 
  } else if (availableSpots(board).length === 0) {
    return 0
  };

  let [moves, scores] = [ [], [] ];
  // For each of the available spots: 
    // Store index of next move.
    // Call minimax (recurssion) as the other player with the new board.
      // Recurssion - This is repeated until it reaches a terminal state and returns a score.
    // Store score of minimax result.
  availableSpots(board).forEach(spot => {
    board[spot] = player;
    moves.push(spot);
    scores.push(minimax(board, (player === bot) ? human : bot));
    board[spot] = 0;
  });

  // Returns the best move
    // Bot: highest score.    Human: lowest score.
  botMove = player === bot ? moves[scores.indexOf(Math.max(...scores))] : moves[scores.indexOf(Math.min(...scores))];
  return player === bot ? Math.max(...scores) : Math.min(...scores);
};