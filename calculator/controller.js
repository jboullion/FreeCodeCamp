

jQuery(document).ready(function($) {

	//Prevent non numeric keys from being entered
	$('#calc-result').keydown(function(e){
		if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || e.which == 110 || e.which == 188 || e.which == 190 || e.which == 8 || e.which == 9 || e.which == 37 || e.which == 39 || e.which == 46 )) {
			return false;
		}
	});


	var current = null,
		previous = null;

	$('.calc-input').click(function(e){
		var number = $('.calc-input').data('key');

		$('#calc-result').val(number);
	});

	$('.calc-input').click(function(e){
		var func = $('.calc-input').data('key');

		switch(func){
			case '=':
				$('#calc-result').val(current);
				break;
			case 'AC':
				$('#calc-result').val('');
				current = null,
				previous = null;
				break;
			case '+':

				break;
			case '-':

				break;
			case '*':

				break;
			case '/':

				break;
			case '%':

				break;
			case '(':

				break;
			case ')':

				break;
		}
	});

});
