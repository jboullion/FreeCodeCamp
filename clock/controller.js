
//https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

//http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

//http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

jQuery(document).ready(function($) {
	var SPEED = 1, //how fast should our clock run?
		SECOND = 1000,
		MINUTE = 60000,
		sessionTime = 25 * MINUTE,
		currentSessionTime = sessionTime,
		breakTime = 5 * MINUTE,
		isBreak = false,
		clockString = getClockString(sessionTime),
		clock = setInterval(clockTimer, SECOND),
		displayWidth = 500,
		displayRadis = displayWidth / 2,
		displayBorder = 10,
		$displayBar = $("#display-bar"),
		alerm = new Audio('http://jboullion.com/chinese-gong-daniel_simon.mp3');


	//show initial time
	displayTime(clockString);

	$displayBar.attr("d", describeArc(displayRadis, displayRadis, displayRadis - displayBorder, 0, 0));


	/**
	 * Event Handlers
	 */

	var updateRate = 150;
	var updateInput = debounce(function() {
 		var target = $(this).data('target');

 		// All the taxing stuff you do
 		$('#'+target).html($(this).val());
 	}, updateRate);

	$('#break-length, #session-length').on('input', updateInput);

	$('#reset-clock').click(function(e){
		breakTime = $('#break-length').val() * MINUTE;
		sessionTime = $('#session-length').val() * MINUTE;

		isBreak = false;

		currentSessionTime = sessionTime;

		clockString = getClockString(sessionTime);
		displayTime(clockString);

		clearInterval(clock);
		clock = setInterval(clockTimer, SECOND);
		$displayBar.attr("d", describeArc(displayRadis, displayRadis, displayRadis, 0, 0));
	});

	$('#pause-clock').click(function(e){

		if($(this).hasClass('playing')){
			$(this).removeClass('playing');
			clearInterval(clock);
		}else{
			$(this).addClass('playing');
			clock = setInterval(clockTimer, SECOND);
		}

		$(this).find('.fa-play').toggle();
		$(this).find('.fa-pause').toggle();

	});

	/**
	 * Functions
	 */
	//our timer
	function clockTimer() {
		currentSessionTime -= SECOND * SPEED;

		if(currentSessionTime <= 0){
			//STOP TIMER, START BREAK
			isBreak = !isBreak;
			alerm.play();

			if(isBreak){
				currentSessionTime = breakTime;
				$('#clock-display').removeClass('working').addClass('break');
			}else{
				currentSessionTime = sessionTime;
				$('#clock-display').removeClass('break').addClass('working');
			}


		}else{

		}

		clockString = getClockString(currentSessionTime);
		displayTime(clockString);

	}

	//convert milliseconds into a time string
	function getClockString(milsecs){
		var totalSeconds = Math.floor(milsecs / SECOND),
			secs = totalSeconds % 60,
			mins = (totalSeconds - secs) / 60;

		//leading zeros
		secs = secs < 10? '0'+secs:secs;

		return mins + ':' + secs;
	}

	//show the time on the clock
	function displayTime(time){
		//display the clock digits
		document.getElementById("clock-time").innerHTML = time;

		//set current timer
		var timeLeft = isBreak? breakTime - currentSessionTime:sessionTime - currentSessionTime;
		var currentTimer =  isBreak? breakTime:sessionTime;

		//calculate arc
		var percentComplete =timeLeft / currentTimer * 100;
		var arcDegrees = Math.floor(percentComplete * 3.6); //percent to degrees

		//display the clock bar
		$displayBar.attr("d", describeArc(displayRadis, displayRadis, displayRadis - displayBorder, 0, arcDegrees));
	}
});
