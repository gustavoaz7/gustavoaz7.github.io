// Selection of Objects
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const start = document.querySelector('#start');
const levels = document.querySelectorAll('.level>button')
const error = document.querySelector('#error');
const bestScr = document.querySelector('.bestScore');
const bestLvl = document.querySelector('.bestLevel');
const selectedTime = document.querySelector('select[name="playTime"]');
const record = document.querySelector('#record');
const difficultyName = ['Easy', 'Normal', 'Hard'];
const difficultyTime = {"0":[1000, 2000], "1":[750, 1500], "2":[200, 750]};
let gameOn = true, playing = false, score, lastHole, i, lastLevel = levels[0], molePopup;

// Setting default time and listening for a change on game duration.
let playTime = 10000; // Time in miliseconds
selectedTime.addEventListener('change', () => {
  playTime = selectedTime[selectedTime.selectedIndex].value*1000;
  // Getting previous records for that specific game duration
  getLocalScores();
})

// Creating our local storage in case this is the first time playing the game.
if (!(localStorage.hasOwnProperty(10000) &&
      localStorage.hasOwnProperty(20000) &&
      localStorage.hasOwnProperty(30000))) {
  for (let a=1; a<4; a++) {
    localStorage.setItem(10000*a, JSON.stringify([['Easy', 0], ['Normal', 0], ['Hard', 0]]));
  }
}

//Gets an array of all duples [difficulty, record]
function getLocal () {
  return JSON.parse(localStorage.getItem(playTime))
};

function randTime (min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randHole () {
  let index = Math.floor(Math.random() * holes.length);
  let hole = holes[index];
  if (hole === lastHole) return randHole();
  lastHole = hole;
  return hole;
}

function popup () {
  let time = randTime(...difficultyTime[i]);
  let hole = randHole();
  hole.classList.add('up');
  molePopup = setTimeout(() => {
    hole.classList.remove('up')
    // When game time is up: stop popping moles up and rewrite our local storage in case of a new record
    if (gameOn) {popup()} else {
      if (score > getLocal()[i][1]) {
        localStorage.setItem(playTime, localStorage.getItem(playTime).replace(JSON.stringify(getLocal()[i]), JSON.stringify([difficultyName[i], score])));
        bestScr.textContent = getLocal()[i][1];
        // Displaying new record message
        record.classList.add('active')
        setTimeout(() => record.classList.remove('active'), 1500)
      }
    }
  }, time) 
}

function hit (e) {
  if (!e.isTrusted) return; // Avoid fake click
  // We want to remove the class 'up' from the hole which is parent of this
  this.parentNode.classList.remove('up')
  score++;
  scoreBoard.textContent = score;
  // Mole goes down on hit and next comes up - Instead of waiting for the setted time to the next one show up
  if (!gameOn) return;
  clearTimeout(molePopup)
  popup();
}

function startGame() {
  // Make sure user selected a level
  if (i == null) {
    error.style.visibility = 'visible';
    setTimeout(() => error.style.visibility = 'hidden', 1500)
    return;
  }
  // Playing flag
  if (playing) {return;}
  playing = !playing;
  gameOn = true;
  score = 0;
  scoreBoard.textContent = score;
  popup();
  // Game ends when game duration is over
  setTimeout(() => {
    gameOn = false;
    playing = false;
  }, playTime)
}

function getLocalScores () {
  // Getting previous records
  bestScr.textContent = getLocal()[i][1];
  i == null ? bestLvl.textContent = "" : bestLvl.textContent = ` - Level ${difficultyName[i]} in ${playTime/1000} seconds`;
}


levels.forEach(level => level.addEventListener('click', function () {
  // Stop game when level is changed
  gameOn = false; 
  playing = false;
  // Activating selected level
  if (lastLevel !== this) lastLevel.classList.remove('active');
  lastLevel = this;
  // Getting index of selected level
  i = difficultyName.findIndex(x => x == this.className.split(" ")[0]);
  this.classList.add('active');
  // Getting previous scores for that specific level
  getLocalScores();
}))
start.addEventListener('click', startGame)
moles.forEach(mole => mole.addEventListener('click', hit))