var __spell_me_WDM = (function(){

	'use strict';

	var timerEl = document.getElementById('time'),
		timeLimit = 60,
		timeRemaining = timeLimit,
		interval = null,
		socket = undefined,
		currentWord = document.getElementById('current_word'),
		userWord = document.getElementById('user_input'),
		gameOver = document.getElementById('game_over');

	function reset(startStraightAway){
		timeRemaining = timeLimit;
		document.body.setAttribute('data-game-over', 'false');
		console.log(interval);
		if(startStraightAway){
			start();
		} else {
			document.body.setAttribute('data-connected', 'false');
		}
	}

	function end(){

		clearInterval(interval);

		gameOver.innerHTML = "<h1>Time's up!</h1><p>You correctly spelled " + document.getElementById('completed').getElementsByTagName('span').length + " countries!</p>";
		document.body.setAttribute('data-game-over', 'true');

		socket.emit('game-ended');

	}

	function decrease(){
		console.log("decrease");
		if (timeRemaining > 0){
			timeRemaining -= 1;
			timerEl.style.height = window.innerHeight * ((timeRemaining / timeLimit)) + "px";
		} else {
			end();
		}


	}

	function newWord(){
		currentWord.textContent = words.random().toLowerCase();
		var u = "";

		for(var x = 0; x < currentWord.textContent.length; x += 1){
			u += "_";
		}

		userWord.textContent = u;

	}

	function start(){

		clearInterval(interval);
		interval = setInterval(decrease, 1000);

		document.body.setAttribute('data-connected', 'true');
		newWord();

	}

	function addWordToList(word){
		var span = document.createElement('span');
		span.textContent = word;
		document.getElementById('completed').appendChild(span);
	}

	function updateInput(letter){

		var currentText = userWord.textContent.split('_')[0];

		if(currentWord.textContent[currentText.length] === letter){
			currentText += letter;

			for(var y = currentText.length; y < currentWord.textContent.length; y += 1){
				currentText += "_";
			}

			userWord.textContent = currentText;

			if(userWord.textContent === currentWord.textContent){
				socket.emit("correct", {});
				addWordToList(currentWord.textContent);
				newWord();
			}

		} else {
			socket.emit('wrong', {});
		}

	}

	function addEvents(){

		socket.on('player-ready', function () {
			start();
		});

		socket.on('player-gone', function () {
			reset(false);
		});

		socket.on('letter', function(data){
			updateInput(data.letter.toLowerCase());
		});

		socket.on('restart', function(){
			reset(true);
		})

	}

	function init(){
		console.log("Initialised");

		socket = io(window.location.origin);

		addEvents();

	}

	return{
		init : init
	};

})();

(function(){
	__spell_me_WDM.init();
})();
