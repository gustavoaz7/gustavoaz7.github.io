const changeTimeBtns = document.querySelectorAll('.changeTimeBtn')
const session = document.querySelector('#lenS')
const rest = document.querySelector('#lenR')
const sound = document.querySelector('#vol>i')
const reset = document.querySelector('#reset')
const play = document.querySelector('#play')
const clock = document.querySelector('#clock')
const display = document.querySelector('#display')
const timer = document.querySelector('#timer')
const timeupSound = document.querySelector('#timeupSound')

let sessionTime = 25;
let restTime = 5;

// Object of functions for each +/- time button
const changeTime = {
  'plusS': () => {
    if (sessionTime < 60) sessionTime++;
    session.innerHTML = sessionTime;
  },
  'minusS': () => {
  if (sessionTime > 5) sessionTime--;
  session.innerHTML = sessionTime;
  },
  'plusR': () => {
    if (restTime < 30) restTime++;
    rest.innerHTML = restTime;
  },
  'minusR': () => {
    if (restTime > 1) restTime--;
    rest.innerHTML = restTime;
  }
};

// Update session/rest time on setup
changeTimeBtns.forEach(btn => btn.addEventListener('click', () => {
  changeTime[btn.id]();
}))

// Change sound icon
let soundFlag = false;
sound.addEventListener('click', function() {
  soundFlag = !soundFlag;
  if (soundFlag) {
    this.classList.remove('fa-volume-up');
    this.classList.add('fa-volume-off')
  } else {
    this.classList.remove('fa-volume-off');
    this.classList.add('fa-volume-up');
  }
})


play.addEventListener('click', startSession);
reset.addEventListener('click', resetSession);

let sessionLeft, restLeft,  // setInterval variables
    startFlag = false,  // Playing/paused flag
    remaining;  // Remaining session/rest time when interval is cleared
function startSession() {
  if (display.textContent === 'Rest') return startRest();
  
  startFlag = !startFlag;
  if (!startFlag) {  // Pause
    play.innerHTML = '<i class="fa fa-play"></i>Play';
    clearInterval(sessionLeft);
  } else {  // Playing
    play.innerHTML = '<i class="fa fa-pause"></i>Pause';
    display.textContent = 'Session';
    clock.style.border = '2px solid rgba(249, 52, 54, 0.9)';
    

    let timeRemaining;
    // If remaining time exists: interval was paused and is returning from where it lasted
    remaining ? timeRemaining = remaining : timeRemaining = sessionTime*60;
    updateTimerDisplay(timeRemaining);

    sessionLeft = setInterval(() => {
      timeRemaining--;
      remaining = timeRemaining;
      if (timeRemaining < 0) {
        if (!soundFlag) timeupSound.play();
        clearInterval(sessionLeft);
        remaining = '';
        clock.style.background = `radial-gradient(rgba(96, 204, 163, 0.7), rgba(46, 204, 113, 0.7) 67%, transparent 72%, transparent)`
        return startRest();
      }
      updateTimerDisplay(timeRemaining);
      updateBackground(sessionTime*60, timeRemaining, true)
    }, 1000)
  }
}

function startRest() {
  startFlag = !startFlag;
  if (startFlag) {  // Pause
    play.innerHTML = '<i class="fa fa-play"></i>Play';
    clearInterval(restLeft);
  } else {  // Playing
    play.innerHTML = '<i class="fa fa-pause"></i>Pause';
    display.textContent = 'Rest';
    clock.style.border = '2px solid rgba(46, 204, 113, 0.9)';

    let timeRemaining;
    // If remaining time exists: interval was paused and is returning from where it lasted
    remaining ? timeRemaining = remaining : timeRemaining = restTime*60;
    updateTimerDisplay(timeRemaining);
  
    restLeft = setInterval(() => {
      timeRemaining--;
      remaining = timeRemaining;
      if (timeRemaining < 0) {
        if (!soundFlag) timeupSound.play();
        clearInterval(restLeft);
        remaining = '';
        display.textContent = 'Session';
        return startSession();
      }
      updateTimerDisplay(timeRemaining);
      updateBackground(restTime*60, timeRemaining, false)
    }, 1000)
  }
}

// Clear all and set it to initial state
function resetSession() {
  clearInterval(sessionLeft);
  clearInterval(restLeft);
  remaining = '';
  startFlag = false;
  play.innerHTML = '<i class="fa fa-play"></i>Play';
  display.textContent = 'Session';
  clock.style.border = '2px solid #eee';
  timer.innerHTML = `${sessionTime}:00`;
  clock.style.background = `radial-gradient(red, red 0%, transparent 0%, transparent)`;
}

function updateTimerDisplay(timeRemaining) {
  let m = Math.floor(timeRemaining/60)
  let s = timeRemaining % 60;
  timer.innerHTML = `${m}:${s < 10 ? '0'+s : s}`;
}

function updateBackground(total, remain, fromCenter) {
  let percent;
  if (fromCenter) {
    percent = (1 - remain / total) * 72;
    clock.style.background = `radial-gradient(rgba(249, 102, 104, 0.65), rgba(249, 52, 54, 0.65) ${percent-5}%, transparent ${percent}%, transparent)`;
  } else {
    percent = remain / total * 75;
    clock.style.background = `radial-gradient(rgba(96, 204, 163, 0.7), rgba(46, 204, 113, 0.7) ${percent-5}%, transparent ${percent}%, transparent)`;
  }
}