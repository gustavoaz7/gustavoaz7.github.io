const NUM_LEVELS = 20;
const on_off = document.querySelector('#switch')
let onFlag = false;
const colors = document.querySelectorAll('.colors')
const start = document.querySelector('#start')
const strict = document.querySelector('#strict')
let strictFlag = false;
const led = document.querySelector('#led')
const display = document.querySelector('#counter>h1')
let counter;
const sets = {};
const speed = {
  Easy: [1600, 1400, 1200, 1100],
  Medium: [1000, 800, 600, 500],
  Hard: [600, 450, 300, 200]
};
let difficulty = 'Medium';
let sequence, index;
let lock = true;


// Select difficulty (game speed)
document.querySelectorAll('input').forEach(level => 
  level.addEventListener('click', (e) => difficulty = e.target.value)
)

// Turn game on
document.getElementById('sw-area').addEventListener('click', isOn);

// Response on color click
colors.forEach(color =>
  color.addEventListener('mousedown', (e) => {
    if (!lock) {
      color.classList.add('active');
      sets.click = setTimeout(() => color.classList.remove('active'), 150);
      document.getElementsByClassName(e.target.id)[0].play();
      userplay(e.target)
    }
  })
)

// Set starting settings or turn game off
function isOn() {
  onFlag = !onFlag;
  if (onFlag) {
    on_off.style.transform = 'translateX(100%)';
    renderDisplay('--');
    document.querySelectorAll('.btn').forEach(b => {
      b.addEventListener('click', listenClick)
    })
  } else {
    on_off.style.transform = 'translateX(0%)';
    renderDisplay(' ');
    lock = true;
    // Remove all timers, styles and event listeners
    clearTimers();
    colors.forEach(color => color.classList.remove('active'));
    document.querySelectorAll('.btn').forEach(b => {
      b.removeEventListener('click', listenClick)
    })
  }
}

// Response for click on 'Start' or 'Strict' buttons
function listenClick() {
  event.target === start ? startGame() : isStrict()
}

// Logic and style for 'Strict' mode
function isStrict() {
  strictFlag = !strictFlag;
  strictFlag ? led.style.background = 'red' : led.style.background = 'maroon';
}

function startGame() {
  counter = 1;
  sequence = new Array(NUM_LEVELS).fill(0).map(x => Math.floor(Math.random() * 4));
  // Remove all timers and styles to start fresh
  clearTimers();
  colors.forEach(color => color.classList.remove('active'));
  gameplay();
}

// Simon plays the sequence for current level
function gameplay() {
  renderDisplay(counter);
  index = 0;
  let n = 0;
  sets.seqStart = setInterval(() => {
    blink(sequence[n]);
    lock = true;  // Blocks user click during Simon sequence
    n++;
    if (n === counter) {  // Last blink of current level
      clearInterval(sets.seqStart);
      lock = false;  // Free to user click on colors
      sets.limit = setTimeout(displayError, 5*timeStep())  // Time limit for user response
    }
  }, 3/2*timeStep())  // Interval of 0.5x between blinks
}

function userplay(elem) {
  if (!lock) {  // If user is allowed to click..
    clearTimeout(sets.limit);  // Clear last time limit
    if (elem.id == sequence[index] && index < counter) {  // Correct & not last click in current level
      index++;
      if (index < counter) sets.limit = setTimeout(displayError, 5*timeStep())  // Time limit for user response
      else if (index === sequence.length) {  // Corrent & last click in full sequence
        lock = true;
        displayWin(elem);
      } else {  // Correct & last click in current level
        counter++;
        lock = true;
        sets.seqStart = setTimeout(gameplay, timeStep()/3)  // Starts next level sequence
      }
    } else displayError(elem);  // Wrong click
  }
}


// UTILITIES

// Set game speed
function timeStep(){
  return counter < 4 ? speed[difficulty][0] :
         counter < 8 ? speed[difficulty][1] :
         counter < 12 ? speed[difficulty][2] :
         speed[difficulty][3];
}

// Style and sound for each blinking
function blink(id) {
  document.getElementsByClassName(id)[0].play();
  document.getElementById(id).classList.add('active');
  sets.removeBlink = setTimeout(() => document.getElementById(id).classList.remove('active'), timeStep())
}

function displayError(elem) {
  lock = true;
  renderDisplay('ER');
  // add error sound (source?)
  clearTimeout(sets.click);  // Clear removing 'blink' from user click
  if (elem) elem.classList.add('active');  // Show last color clicked by user
  sets.dispEr = setTimeout(() => {
    if (strictFlag) counter = 1;  // Back to level 1 on Strict mode
    renderDisplay(counter);
    if (elem) elem.classList.remove('active');  // Hide last color...
    // remove error sound (source?)
    sets.restart = setTimeout(() => {
      if (strictFlag) startGame()  // Start again if on Strict mode
      else gameplay(counter);  // Try again if not on Strict mode
    }, 2*timeStep()) 
  }, 2*timeStep())
}

function displayWin(elem) {
  lock = true;
  renderDisplay(':)');
  clearTimeout(sets.click);  // Clear removing 'blink' from user click
  // Consecutive blinking on last clicked color
  let i = 0;
  sets.dispWin = setInterval(() => {
    elem.classList.add('active');
    // add win sound (source?)
    sets.limit = setTimeout(() => {
      elem.classList.remove('active');
      // remove win sound (source?)
    }, 100)
    i++;
    if (i === 5) clearInterval(sets.dispWin);
  }, 200)
}

function renderDisplay(counter) {
  typeof counter === 'string' ? display.textContent = counter :
  counter < 10 ? display.textContent = `0${counter}` : display.textContent = counter;
}

function clearTimers() {
  Object.keys(sets).forEach(key => {
    clearInterval(sets[key]);
    clearTimeout(sets[key]);
  });
}
