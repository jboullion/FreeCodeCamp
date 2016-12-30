

jQuery(document).ready(function($) {

	//Prevent non numeric keys from being entered
	$('#calc-result').keydown(function(e){
		if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || e.which == 110 || e.which == 188 || e.which == 190 || e.which == 8 || e.which == 9 || e.which == 37 || e.which == 39 || e.which == 46 )) {
			return false;
		}
	});


	var current = '0',
		currentVal = 0,
		savedVal = 0,
		calcVal = 0,
		funcTrain = [],
		$calcResult = $('#calc-result span'),
		savedFunc = '';

	$('.calc-input').on('click', function(e){
		//we only want 20 digits at once
		if(current.length >= 20)	return;

		var number = $(this).data('key');

		if(number === '.'){
			//we only add 1 decimal place in this number
			if(current.indexOf('.') === -1){
				current += '.'
			}else if (current.indexOf('.') === 0) {
				current = 0+current;
			}

		}else{
			//this is a normal value..stick it onto the end of our current entry.
			current = current+''+number;

			//now we get the float value of that string.
			currentVal = parseFloat(current);
		}

		//no leading zeros please
		if(current.length >= 2 && current.indexOf('0') === 0 ){
			current = current.substring(1);
		}else if( current.indexOf('-') === 0 && current.indexOf('0') === 1){
			//no leading zeros when making a negative number
			current = '-'+current.substring(2);
		}

		//prevent having just a decimal in the entry
		if(current.indexOf('.') === 0) {
			current = 0+current;
		}

		//display number
		$calcResult.html(current);
	});

	$('.calc-function').click(function(e){
		var func = $(this).data('key');

		//if we are clearing, run that and skip the rest
		if(func === 'AC' || func === 'CE'){
			doFunc(func);
			return;
		}

		//allow the user to make negative numbers. Can probably just base it off of currentVal
		if(func === '-' && (current === '0' || current === '-0' || currentVal === 0 ) ){
			current = '-0';
			currentVal = -0; //this actually works. Thank you crazy math standards.
			$calcResult.html(current);
			return;
		}

		//if we have a function saved in memory, lets run it
		if(savedFunc != ''){

			doFunc(savedFunc);

			//if we hit equals it means we want to see the total
			if(func === '='){
				$calcResult.html(calcVal);
			}
		}else{
			//set the initial value to our running total / calc val
			calcVal = currentVal;
		}

		//save our current value for next function call
		savedVal = currentVal;

		//reset our current value
		current = '';
		currentVal = 0;

		// delay the function call until next function call
		savedFunc = func;

	});

	//most of the calculator functions
	function doFunc(func){
		switch(func){
			case 'AC':
				current = '0';
				$calcResult.html(current);
				currentVal = 0;
				calcVal = 0;
				savedVal = 0;
				savedFunc = '';
				break;
			case 'CE':
				current = '0';
				$calcResult.html(current);
				currentVal = 0;
				break;
			case '+':
				calcVal += currentVal;
				$calcResult.html(calcVal);
				break;
			case '-':
				calcVal -= currentVal;
				$calcResult.html(calcVal);
				break;
			case '*':
				calcVal *= currentVal;
				$calcResult.html(calcVal);
				break;
			case '/':
				calcVal /= currentVal;
				$calcResult.html(calcVal);
				break;
			case '%':
				calcVal = calcVal % currentVal;
				$calcResult.html(calcVal);
				break;
			case 'sqrt':
				calcVal = Math.sqrt(calcval);
				$calcResult.html(calcVal);
				break;
		}
	}
});
