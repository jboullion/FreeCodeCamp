
document.addEventListener("DOMContentLoaded", function(event) {

	//Gamestate
	var game = {
		playing: false, //aka started
		speed: 750, //the speed between showings. Increases over time.
		decrementSpeed: 150,
		delay: 200, //delay between interactions
		hold: false, //delay between interactions
		strict: false, //strict mode
		showing: false, //the game is showing the paddles to hit.
		count: 1, //current count / steps
		pattern: [], //this array will hold the game steps
		nextPaddle: null, //what is the nextPaddle the user has to hit
		userStep: 0, //track the current user steps.
		maxCount: 20 //maximum number of turns
	};

	//paddle values
	var GREEN = 0,
		RED = 1,
		YELLOW = 2,
		BLUE = 3;

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
		startFreq = 0,
		strictFreq = 0,
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

		//build a new game pattern
		game.pattern = [];
		for(var s = 0; s < game.maxCount; s++){
			game.pattern.push(getRandomInt(GREEN,BLUE));
		}

		show();
	}

	//run through the game pattern up to the current count
	function show(){

		displayCount();

		var c = 0;
		var counting = setInterval(function() {

			showPaddle(game.pattern[c]);
			if (++c === game.count) {
				window.clearInterval(counting);
				game.showing = false;
			}

		},game.speed);

		//the next paddle the user must hit
		userStep = 0;
		game.nextPaddle = game.pattern[userStep];

	}

	//update the count display value
	function displayCount(){
		$count.innerHTML = game.count<10?'0'+game.count:game.count;
	}

	//when the AI is showing the paddle, use this function
	function showPaddle(paddle){
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

			hitButton(button, freq);

			var paddleID = button.getAttribute("data-id");

			if(game.nextPaddle == paddleID){
				userStep++;
				if(userStep === game.count){
					nextStep();
				}else{
					game.nextPaddle = game.pattern[userStep];
				}

			}else{
				wrongButton();
			}

		}
	}

	//what do we do when a user hits the wrong button
	function wrongButton(){

		if(game.strict){
			lose();
		}else{
			playAgain();
		}
	}

	//player loses and goes back to start
	function lose(){
		//let the player know they errored
		$count.innerHTML = '!!';
		game.showing = true;
		setTimeout(function(){
			start();
		}, game.delay * 10);
	}

	//when not in strict mode, we want to see the pattern again
	function playAgain(){
		//let the player know they errored
		$count.innerHTML = '!!';

		game.showing = true;

		setTimeout(function(){
			show();
		}, game.delay * 10);
	}

	//move to the next step in the game pattern and show the pattern
	function nextStep(){
		game.count++;
		//every third round increase the speed
		if(game.count === 5 || game.count === 9 || game.count === 13){
			game.speed -= game.decrementSpeed;
		}
		game.showing = true;

		show();
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

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}
});
