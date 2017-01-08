
document.addEventListener("DOMContentLoaded", function(event) {

	//Gamestate
	var game = {
		playing: true, //aka started
		speed: 500, //the speed between showings. Increases over time.
		delay: 200, //delay between interactions
		hold: false, //delay between interactions
		strict: false, //strict mode
		showing: false, //the game is showing the paddles to hit.
		count: 3, //current count / steps
		pattern: [], //this array will hold the game steps

	};

	//paddle values
	var GREEN = 0,
		RED = 1,
		YELLOW = 2,
		BLUE = 3;

	//track the current user steps.
	var userPattern = [];

	//DOM Elements
	var $greenPaddle = document.getElementsByClassName("paddle green")[0];
		$redPaddle = document.getElementsByClassName("paddle red")[0];
		$yellowPaddle = document.getElementsByClassName("paddle yellow")[0];
		$bluePaddle = document.getElementsByClassName("paddle blue")[0];
		$start = document.getElementById("start"),
		$strict = document.getElementById("strict"),
		$strictIndicator = document.getElementById("strict-indicator"),
		$count = document.getElementById("count");
		//$onOffSwitch = document.getElementById("on-off-switch");

	//Sounds
	var greenFreq = 330,
		redFreq = 260,
		yellowFreq = 220,
		blueFreq = 175,
		startFreq = 500,
		strictFreq = 500,
		onOffSound = new Audio('powerswitch.mp3');


	//Audio Element and Oscillator
	//http://stackoverflow.com/a/16573282/715879, user: snapfractalpop
	var audioPlayer = new (window.AudioContext || window.webkitAudioContext)();
	var oscillator = audioPlayer.createOscillator();

	//Event Handlers
	$greenPaddle.addEventListener("click", function(){
		hitPaddle(this, greenFreq);
	});

	$redPaddle.addEventListener("click", function(){
		hitPaddle(this, redFreq);
	});

	$yellowPaddle.addEventListener("click", function(){
		hitPaddle(this, yellowFreq);

	});

	$bluePaddle.addEventListener("click", function(){
		hitPaddle(this, blueFreq);
	});

	$start.addEventListener("click", function(){
/*
		if(game.playing === false){
			//FIRST START
			start();

		}else{
			//RESET

		}
*/
		start();

		hitButton(this, startFreq);
	});

	$strict.addEventListener("click", function(){
		//if(game.playing === false ){
			hitButton(this, strictFreq);
			game.strict = !game.strict;

			if(game.strict){
				$strictIndicator.classList.add("on");
			}else{
				$strictIndicator.classList.remove("on");
			}

		//}
	});


/*
	$onOffSwitch.addEventListener("click", function(){
		if(game.hold === false){
			onOffSound.play();

			//prevent pressing another paddle right away
			game.hold = true;
			setTimeout(function(){game.hold = false;}, game.delay);
		}
	});
*/


	/**
	 * FUNCTIONS BEGIN
	 */

	//start the game
	function start(){
		game.playing = true;
		game.showing = true;

		game.count = 1;
		displayCount();

		//build a new game pattern
		game.pattern = [];
		for(var s = 0; s < 21; s++){
			game.pattern.push(Math.floor(Math.random() * 4));
		}

		console.log(game);

		show();
	}

	function show(){

		var c = 0;
		var counting = setInterval(function() {
			console.log(c);
			showPaddle(game.pattern[c]);
			if (++c === game.count) {
				window.clearInterval(counting);
			}
		},game.speed);


	}

	function displayCount(){
		$count.innerHTML = game.count<10?'0'+game.count:game.count;
	}

	function showPaddle(paddle){
		console.log('Paddle: '+paddle);
		var $button = null;

		switch(paddle){
			case GREEN:
				$button = $greenPaddle;
				freq = greenFreq;
				break;
			case RED:
				$button = $redPaddle;
				freq = redFreq;
				break;
			case YELLOW:
				$button = $yellowPaddle;
				freq = yellowFreq;
				break;
			case BLUE:
				$button = $bluePaddle;
				freq = blueFreq;
				break;
		}

		hitButton($button, freq);
	}

	//paddles have slightly different requirements than other buttons
	function hitPaddle(button, freq){
		if(game.showing === false){
			hitPaddle(button, freq);
		}
	}

	//turn a button on and off.
	function hitButton(button, freq){
		if(game.hold === false
		&& game.playing === true ){
			button.classList.add("active");
			playFrequency(freq);

			//prevent pressing another paddle right away
			game.hold = true;
			setTimeout(function(){
				game.hold = false;
				button.classList.remove("active");
			}, game.delay);
		}
	}

	//play a given frequency for X milliseconds
	function playFrequency(freq, duration){
		//set a default duration
		duration = duration?(duration/1000):(game.delay/1000)
		duration = Math.round( duration * 100) / 100;

		oscillator = audioPlayer.createOscillator(); // instantiate an oscillator
		oscillator.connect(audioPlayer.destination); // connect it to the destination
		oscillator.frequency.value = freq;
		oscillator.start();
		oscillator.stop(audioPlayer.currentTime + duration);

	}
});
