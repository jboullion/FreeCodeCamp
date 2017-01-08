
document.addEventListener("DOMContentLoaded", function(event) {

	//DOM Elements
	var $greenPaddle = document.getElementsByClassName("paddle green")[0];//$('.paddle.green'),
		$redPaddle = document.getElementsByClassName("paddle red")[0];//$('.paddle.red'),
		$yellowPaddle = document.getElementsByClassName("paddle yellow")[0];//$('.paddle.yellow'),
		$bluePaddle = document.getElementsByClassName("paddle blue")[0];//$('.paddle.blue');

	//Sounds
	var greenFreq = 330,
		redFreq = 260,
		yellowFreq = 220,
		blueFreq = 165,
		freqDuration = 200;

	var pizzPlayer = new Pizzicato.Sound({
		source: 'wave',
		options: {
			frequency: 330
		},
	});

	$greenPaddle.addEventListener("click", function(){
		playFrequency(greenFreq);
	});

	$redPaddle.addEventListener("click", function(){
		playFrequency(redFreq);
	});

	$yellowPaddle.addEventListener("click", function(){
		playFrequency(yellowFreq);
	});

	$bluePaddle.addEventListener("click", function(){
		playFrequency(blueFreq);
	});

	//play a given frequency for X milliseconds
	function playFrequency(freq, duration){

		//if we are already playing a sound, gtfo
		if(pizzPlayer.playing) return;

		//set a default duration
		if(!duration) duration = freqDuration;

		//set the frequency
		pizzPlayer.sourceNode.frequency.value = freq;

		pizzPlayer.play();

		//end frequency shortly
		setTimeout(function(){
			pizzPlayer.pause();
			pizzPlayer.currentTime = 0;
		}, duration);
	}
});
