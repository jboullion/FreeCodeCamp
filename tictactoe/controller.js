
jQuery(document).ready(function($) {

	var xTurn = true;

	//Create our SVG Pieces :)
	var oPath = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	oPath.setAttribute('cx', '50%');
	oPath.setAttribute('cy', '50%');
	oPath.setAttribute('r', '30%');
	oPath.setAttribute('fill', 'none');

	var xPath1 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	xPath1.setAttribute('x1', '20%');
	xPath1.setAttribute('y1', '20%');
	xPath1.setAttribute('x2', '80%');
	xPath1.setAttribute('y2', '80%');

	var xPath2 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
	xPath2.setAttribute('x1', '80%');
	xPath2.setAttribute('y1', '20%');
	xPath2.setAttribute('x2', '20%');
	xPath2.setAttribute('y2', '80%');

	$('.piece.open').click(function(e){

		var svg = $(this)[0];

		if(xTurn){
			//Display X
			var whatPath = xPath1.cloneNode(true);
			svg.appendChild(whatPath);
			whatPath = xPath2.cloneNode(true);
			svg.appendChild(whatPath);
			$(this).addClass('piece-x');
		}else{
			//Display O
			var whatPath = oPath.cloneNode(true);
			svg.appendChild(whatPath);
			$(this).addClass('piece-o');
		}

		xTurn = !xTurn;

		$(this).removeClass('open');

	});

});
