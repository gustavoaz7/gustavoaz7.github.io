var playing = false, num = [], alt = [], randNum, randAlt, correctAlt, correctPos, i, score = 0, time = 60, correctAnswer;

function generateNumbers () {
	for (i = 0; i < 2; i++) {
		randNum = Math.floor(Math.random() * 9 + 1);
		if (num.indexOf(randNum) < 0) {
			num[i] = randNum;
		} else {
			i--;
		}
	}
	document.querySelector('#problem').getElementsByTagName('p')[0].innerHTML = `${num[0]} x ${num[1]}`;
	correctAnswer = num[0] * num[1];
	console.clear();
	for (i = 0; i < 4; i++) {
		randAlt = Math.floor(Math.random() * 81 + 1);
		if ((randAlt != correctAnswer) && (alt.indexOf(randAlt) < 0)) {
			alt[i] = randAlt;
		} else {
			i--;
		};
		if (i < 0) {continue} else {
			console.log(`#alt${i}`, `${alt[i]}`);
			document.querySelector(`#alt${i}`).getElementsByTagName('p')[0].innerHTML = `${alt[i]}`;
		}
	}
	correctPos = Math.floor(Math.random() * 4);
	alt[correctPos] = correctAnswer;
	correctAlt = document.querySelector(`#alt${correctPos}`);
	correctAlt.getElementsByTagName('p')[0].innerHTML = `${alt[correctPos]}`;
}

function countDown () {
	var timeDown = setInterval(() => {
		time--;
		document.querySelector('#timeRemain').innerHTML = time;
		if (time == 0) {
			clearInterval(timeDown);
			document.querySelector('#finalScore').innerHTML = score;
			show('#gameOver');
			hide('#time');
			hide('#wrong');
			hide('#right');
			hide('#problem');
			hide('#answers');
			document.querySelector('#start').getElementsByTagName('p')[0].innerHTML = "Start Game";
		}
	}, 1000)
}

function rightWrong () {
	if (this != correctAlt) {
		hide('#right');
		show('#wrong');
		setTimeout(function (){hide('#wrong')}, 1000);
	}
	if (this === correctAlt) {
		score++;
		hide('#wrong');
		show('#right');
		setTimeout(function() {hide("#right")}, 1000);
		startRound();
	}
}

function startRound () {
	document.querySelector('#scoreValue').innerHTML = score;
	generateNumbers();
	document.querySelectorAll('.alt').forEach(a => a.addEventListener('click', rightWrong));
}

function hide(e) {
	document.querySelector(e).style.visibility = 'hidden';
}
function show(e) {
	document.querySelector(e).style.visibility = 'visible';
}

function setGame () {
	if (playing) {location.reload()};
	playing = !playing;

	document.querySelector('#start').getElementsByTagName("p")[0].innerHTML = "Reset Game";

	show("#time");

	document.querySelector('#scoreValue').innerHTML = score;

	startRound();
	countDown();
}

document.querySelector('#start').addEventListener('click', setGame)
