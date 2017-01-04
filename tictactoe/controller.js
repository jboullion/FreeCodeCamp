
$(function() {

	// Is it players turn?
	var pTurn = true,
		PLAYERS = 1,
		currentTurn = 1,
	//array to hold piece placements
		pieceArray = [[0,0,0],[0,0,0],[0,0,0]],
	//I don't know if this is stupid or genius
	//Setting up values to use math to find winner
		X_VALUE = 1,
		O_VALUE = 4,
		X_WIN = X_VALUE * 3,
		O_WIN = O_VALUE * 3,
		X_RISK = X_WIN - X_VALUE,
		O_ADV = O_WIN - O_VALUE,
		WINNER = false,
		DEBUG = true;

	//we have an svg template we can use as our blank piece HTML
	var pieceTemplate = $('#piece-tempate').html();

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

	//used every round
	var rowSum = 0,
		colSum = 0,
		ltrDiagSum = 0,
		rtlDiagSum = 0,
		rRow = 0;

	/**
	 * Place a piece on click. Even after new pieces are placed
	 */
	$('#tictactoe-board').on('click', '.piece.open', function(e){
		var svg = $(this)[0],
			row = $(this).data('row'),
			col = $(this).data('column');

		displayX(row,col);

		endTurn();
	});

	//Display the X svg image
	function displayX(row, col){
		var $svg = $('#square-'+row+'-'+col+' svg'),
			svg = $svg[0];

		$svg.removeClass('open').addClass('piece-x');
		pieceArray[row][col] = X_VALUE;

		var whatPath = xPath1.cloneNode(true);
		svg.appendChild(whatPath);
		whatPath = xPath2.cloneNode(true);
		svg.appendChild(whatPath);
	}

	//Display the O svg image
	function displayO(row, col){
		var $svg = $('#square-'+row+'-'+col+' svg'),
			svg = $svg[0];
		console.log('row: '+row+', col: '+col);

		$svg.removeClass('open').addClass('piece-o');
		pieceArray[row][col] = O_VALUE;

		var whatPath = oPath.cloneNode(true);
		svg.appendChild(whatPath);
	}

	/**
	 *  Ends Turn
	 */
	function endTurn(){

		WINNER = checkWin();

		//Winner!
		if(WINNER !== false){
			alert(WINNER+' Wins!');
			resetGame();
			return;
		}

		//Did we run out of turns?
		if(currentTurn === 9){
			alert('DRAW!!');
			resetGame();
			return;
		}

		//No Winner this round, next turn;
		pTurn = !pTurn;
		currentTurn++;

		//take next turn
		if(PLAYERS === 1 && !pTurn){
			aiTurn();
			endTurn();
		}

	}

	function aiTurn(){
		ltrDiagSum = 0;
		rtlDiagSum = 0;

		if(DEBUG === true){
			console.log('AI Turn');
		}

		//If AI goes first, then I think a corner is better
		/*
		if(pieceArray[0][0] === 0){
			displayO(0,0);
			endTurn();
			return;
		}
		*/

		//always take middle piece if possible.
		if(pieceArray[1][1] === 0){
			displayO(1,1);
			return;
		}

		//are any of the rows in a win condition?
		for(var row = 0; row < pieceArray.length; row++){
			countPieces(row);

			//Check our columns for adv and risk
			if (advOrRisk(colSum)) {
				//this column is in trouble, find an open space!
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[col][row] === 0){
						//Open!
						if(DEBUG === true){
							console.log('column placement');
						}
						displayO(col,row);
						return;
					}
				}
			}

			//Check our rows for adv and risk
			if (advOrRisk(rowSum)) {
				//this row is in trouble, find an open space!
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[row][col] === 0){
						//Open!
						displayO(row,col);
						return;
					}
				}
			}

			//ltr or top to bottom diagonal, [0,0],[1,1][2,2]
			if (advOrRisk(ltrDiagSum)) {
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[col][col] === 0){
						//Open!
						displayO(col,col);
						return;
					}
				}
			}

			//rtl or bottom to top diagonal, [2,0],[1,1][0,2]
			if (advOrRisk(rtlDiagSum)) {
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[pieceArray[row].length-col-1][col] === 0){
						//Open!
						displayO(pieceArray[row].length-col-1,col);
						return;
					}
				}
			}

		}

		//Just find the first open piece
		for(var row = 0; row < pieceArray.length; row++){
			for(var col = 0; col < pieceArray[row].length; col++){
				if(pieceArray[row][col] === 0){
					displayO(row,col);
					return;
				}
			}
		}

	}

	function advOrRisk(value){
		if (value === O_ADV || value === X_RISK ) {
			return true
		}

		return false;
	}

	//do some counting of place values that we have to do every turn
	function countPieces(row){
		rowSum = pieceArray[row].reduce(add, 0);
		colSum = 0;

		ltrDiagSum += pieceArray[row][row]; //00, 11, 22

		//get the other diagonal
		rRow = pieceArray.length - row - 1;
		rtlDiagSum += pieceArray[rRow][row]; //20, 11, 02

		//now check the nth (row) column
		for(var col = 0; col < pieceArray[row].length; col++){
			//reverse our cols and rows and we can check columns too!
			colSum += pieceArray[col][row];
		}
	}

	//Check all the rows, columns and diagonals
	function checkWin(){
		ltrDiagSum = 0;
		rtlDiagSum = 0;

		//are any of the rows in a win condition?
		for(var row = 0; row < pieceArray.length; row++){

			countPieces(row);

			//Do we have a winner?
			if(rowSum === X_WIN || colSum === X_WIN || ltrDiagSum === X_WIN || rtlDiagSum === X_WIN){
				return 'X';
			}else if (rowSum === O_WIN || colSum === O_WIN || ltrDiagSum === O_WIN || rtlDiagSum === O_WIN) {
				return 'O';
			}
		}

		return false;
	}

	/**
	 * Reset the game
	 */
	function resetGame(){
		pTurn = true;
		currentTurn = 1;
		pieceArray = [[0,0,0],[0,0,0],[0,0,0]];
		WINNER = false;

		var piece;

		//reset our pieces
		for(var row = 0; row < pieceArray.length; row++){
			for(var col = 0; col < pieceArray[row].length; col++){

				//build our piece
				piece = PeaceMaker(pieceTemplate, {
						row: row,
						col: col
					});

				//put a blank svg in place
				$('#square-'+row+'-'+col).html(piece);
			}
		}

	}

	//add 2 numbers.
	function add(a, b) {
		return a + b;
	}

	/**
	 * Make pieces our of the given data object.
	 */
	function PeaceMaker(tpl, data) {
		var re = /<%([^%>]+)?%>/g, match;
		while(match = re.exec(tpl)) {
			tpl = tpl.replace(match[0], data[match[1]])
		}
		return tpl;
	}

});
