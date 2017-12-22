// Selection of objects
const game = document.querySelector('#game')
const score = document.querySelector('#score')
const scoreVal = document.querySelector('#scoreValue')
const scoreBest = document.querySelector('#bestScore')
const life = document.querySelector('#life')
const instruction = document.querySelector('#instruction')
const start = document.querySelector('#start')
const gameover = document.querySelector('#gameOver')
const finalScore = document.querySelector('#finalScore')
const fruit = document.querySelector('.fruit')
const slicesound = document.querySelector('#slicesound')
const fruits = [
	'https://vignette3.wikia.nocookie.net/fruitninja/images/1/16/Kiwi_Fruit.svg',
	'https://vignette2.wikia.nocookie.net/fruitninja/images/0/07/Pear.svg',
	'https://vignette3.wikia.nocookie.net/fruitninja/images/e/e2/Strawberry.svg',
	'https://vignette1.wikia.nocookie.net/fruitninja/images/d/d1/Cherry.svg',
	'https://vignette2.wikia.nocookie.net/fruitninja/images/4/43/Orange.png',
	'https://vignette1.wikia.nocookie.net/fruitninja/images/e/e6/Plum.png',
	'https://vignette4.wikia.nocookie.net/fruitninja/images/3/34/Lime.png'
];
let lastFruit, step, trials, scoreCount = 0, playing = false, fruitDown;

scoreVal.textContent = scoreCount;

// Creating a localSorage in case there is nothing saved there
if (!localStorage.length) localStorage.setItem('Score', "");
// Setting best score of all time as the stored value
scoreBest.textContent = "Best: " + localStorage.getItem('Score');


function startGame() {
	// If already playing (reset button was clicked) - Reload page;
	if (playing) return location.reload();
	playing = true;
	// Setting up starting configuration
	trials = 3;
	step = 0;
	scoreCount = 0;
	while (life.childElementCount < 3) $('#life').append('<img src="http://icons.iconarchive.com/icons/succodesign/love-is-in-the-web/48/heart-icon.png" alt="">');
	// Removing any configuration from previous games
	if (gameover.classList) {
		gameover.classList.remove('active');
		game.style.filter = 'grayscale(0%)';
	}

	// Animating introduction
	animateInstr();
	// Game starts after the initial animation
	setTimeout(() => {
		styleStart();
		newFruit();
		fruit.addEventListener('mouseover', () => {clearInterval(fruitDown); fruitSlice();})
	}, 1250)
}

function animateInstr() {
	instruction.classList.add('active');
	instruction.animate([{
		transform: 'translateX(-100%) scale(0.3)',
		opacity: 0
	}, {
		transform: 'translateX(0%) scale(1)',
		opacity: 0.95
	}], 250);
	setTimeout(() => instruction.animate([{
			transform: 'translateX(0%) scale(1)',
			opacity: 0.95
		}, {
			transform: 'translateX(100%) scale(0.3)',
			opacity: 0
		}], 250), 1000);
	setTimeout(() => instruction.classList.remove('active'), 1000)
}

// Changing Start button when game is on
function styleStart() {
	start.querySelector('p').textContent = 'Reset Game';
	start.classList.add('active');
}

// Selecting a random fruit
function pickFruit() {
	let i = Math.floor(Math.random()*fruits.length);
	if (lastFruit === fruits[i]) pickFruit();
	lastFruit = fruits[i];
	return fruits[i];
}

// Selecting a horizontally random position to place the fruit 
function horizPosition() {
	let area = game.getBoundingClientRect();
	let item = fruit.getBoundingClientRect();
	return Math.random()*(area.width - item.width);
}

// Setting the fruit in position
function positionFruit() {
	fruit.setAttribute('src', pickFruit())
	fruit.style.left = `${horizPosition()}px`;
	fruit.style.top = `-${fruit.offsetHeight}px`;
	fruitDownF();
	// $(#game).append(`<img class="fruit" src="${pickFruit()}" >`)  -  This method allows to appear more than one fruit in game at the same time
}

// Fruits falling movement
function fruitDownF() {
	fruitDown = setInterval(() => {
		step += randStep;
		fruit.style.top = `${-fruit.offsetHeight + step}px`;

		// When fruit desapears from the screen 
		if (fruit.offsetTop >= game.offsetHeight) {
			// Lose one life. When user still has trials left -> Call for a new fruit.
			if (trials > 1) {
				trials--;
				life.lastElementChild.remove();
				clearInterval(fruitDown)
				return newFruit();
			}
			// When user runs out of trials -> Game over
			life.lastElementChild.remove();
			clearInterval(fruitDown)
			gameOverF();
		}
	}, 10)
}

// Setting a new falling speed and a fruits position
function newFruit() {
	step = 0;
	randStep = 2 + Math.round(Math.random()*(1 + Math.round(Math.random()*9)));
	positionFruit();
}

// Actions when fruit is sliced
// Increase score, play sound, slicing animation, and a new fruit is called
function fruitSlice() {
	scoreCount++;
	scoreVal.textContent = scoreCount;
	slicesound.currentTime = 0;
	slicesound.play();
	$(".fruit").hide("explode", 400);
	setTimeout(() => {newFruit(); $(".fruit").show()}, 500) ;
}

// Actions when game is over
function gameOverF() {
	// Show game over and score message, apply gray filter, change start button, set final score to current score
	gameover.classList.add('active');
	game.style.filter = 'grayscale(30%)';
	start.querySelector('p').textContent = 'Start Game';
	start.classList.remove('active');
	finalScore.textContent = scoreCount;
	// Setting a new record in case of a higher finalScore then the previously stored
	if (scoreCount > localStorage.getItem('Score')) {
		localStorage.setItem('Score', scoreCount);
		$(".go").text('New Record!!')
	}
	scoreBest.textContent = "Best: " + localStorage.getItem('Score');
}

start.addEventListener('click', startGame)



