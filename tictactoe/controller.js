
jQuery(document).ready(function($) {

	// Is it players turn?
	var pTurn = true,
	//array to hold piece placements
		pieceArray = [[0,0,0],[0,0,0],[0,0,0]],
	//I don't know if this is stupid or genius
	//Setting up values to use math to find winner
		X_VALUE = 1,
		Y_VALUE = 4,
		X_WIN = X_VALUE * 3,
		Y_WIN = Y_VALUE * 3,
		WINNER = '';

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


	/**
	 * Place a piece on click
	 */
	$('.piece.open').click(function(e){
		var svg = $(this)[0],
			row = $(this).data('row'),
			column = $(this).data('column');

		if(pTurn){
			//Display X
			var whatPath = xPath1.cloneNode(true);
			svg.appendChild(whatPath);
			whatPath = xPath2.cloneNode(true);
			svg.appendChild(whatPath);

			$(this).addClass('piece-x');
			pieceArray[row][column] = X_VALUE;
		}else{
			//Display O
			var whatPath = oPath.cloneNode(true);
			svg.appendChild(whatPath);

			$(this).addClass('piece-o');
			pieceArray[row][column] = Y_VALUE;
		}

		$(this).removeClass('open');

		endTurn();
	});


	/**
	 *  Ends Turn
	 */
	function endTurn(){
		var rowSum = 0,
			colSum = 0,
			ltrDiagSum = 0,
			rtlDiagSum = 0,
			rRow = 0;

		//are any of the rows in a win condition?
		for(var row = 0; row < pieceArray.length; row++){
			rowSum = pieceArray[row].reduce(add, 0);
			colSum = 0;
			//now check the nth (row) column
			for(var col = 0; col < pieceArray[row].length; col++){
				//reverse our cols and rows so we can check both directions
				colSum += pieceArray[col][row];
			}

			ltrDiagSum += pieceArray[row][row];

			//get the other diagonal
			rRow = pieceArray.length - row - 1;
			rtlDiagSum += pieceArray[rRow][row];

			//Do we have a winner?
			if(rowSum === X_WIN || colSum === X_WIN || ltrDiagSum === X_WIN || rtlDiagSum === X_WIN){
				WINNER = 'X';
			}else if (rowSum === Y_WIN || colSum === Y_WIN || ltrDiagSum === Y_WIN || rtlDiagSum === Y_WIN) {
				WINNER = 'O';
			}

		}

		//Winner!
		if(WINNER !== ''){
			alert('You Win');
		}

		//No Winner this round, next turn;
		pTurn = !pTurn;
	}

	function add(a, b) {
		return a + b;
	}

});
