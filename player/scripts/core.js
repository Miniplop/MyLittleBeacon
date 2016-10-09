var __spell_me_WDM = (function(){

	'use strict';

	var socket = undefined,
		input = document.getElementsByTagName('input')[0],
		status = document.getElementById('status'),
		statusTO = null;

	function updateStatus(correct){

		if(correct){
			status.textContent = "CORRECT!";
			status.setAttribute('class', 'correct');
			input.value = "";
		} else {
			status.textContent = "WRONG!";
			status.setAttribute('class', 'wrong');
		}

		status.setAttribute('data-visible', 'true');

		if(statusTO !== null){
			clearTimeout(statusTO);
		}

		statusTO = setTimeout(function(){

			status.setAttribute('data-visible', 'false');

		}, 1000);

	}

	function askToRestart(){
		document.getElementById('restart').setAttribute('data-visible', 'true');
	}

	function addEvents(){

		input.addEventListener('keyup', function(e){

			if(e.keyCode === 8){
				socket.emit('player-error', {});
				updateStatus(false);
			}

			socket.emit('player-letter', {letter : this.value[this.value.length - 1]})

		}, false);

		socket.on('wrong', function(){
			updateStatus(false);
		});

		socket.on('correct', function(){
			updateStatus(true);
		});

		socket.on('game-ended', function(){
			askToRestart();
		});

		document.getElementById('restart').addEventListener('click', function(){
			socket.emit('restart', {});
			this.setAttribute('data-visible', 'false');
		}, false);

	}

	function init(){
		console.log("Initialised");

		socket = io(window.location.origin);

		socket.emit('player-ready', {});

		input.focus();

		addEvents();

	}

	return{
		init : init
	};

})();

(function(){
	__spell_me_WDM.init();
})();
