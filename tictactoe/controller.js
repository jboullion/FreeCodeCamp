
$(function() {

	// Is it players turn?
	var pTurn = true,
		PLAYERS = 1,
		PLAYER = '',
		currentTurn = 1,
	//array to hold piece placements
		pieceArray = [[0,0,0],[0,0,0],[0,0,0]],
	//I don't know if this is stupid or genius
	//Setting up values to use math to find winner
	//I tried to set it up slightly generically so that a 4x4 or larger board could be built without much hassle
		X_VALUE = 1,
		O_VALUE = 4,
		X_WIN = X_VALUE * pieceArray.length,
		O_WIN = O_VALUE * pieceArray.length,
		X_ADV = X_WIN - X_VALUE,
		O_ADV = O_WIN - O_VALUE,
		AI_ADV = 0,
		AI_RISK = 0,
		WINNER = false,
		DEBUG = true;

	//we have an svg template we can use as our blank piece HTML
	var pieceTemplate = $('#piece-tempate').html();

	$notice = $('#turn-notice h2');

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

		if(! pTurn) return;

		var row = $(this).data('row'),
			col = $(this).data('column');

		if(PLAYER === 'X'){
			displayX(row,col);
		}else{
			displayO(row,col);
		}

		endTurn();
	});

	/**
	 * Reset the game on button press
	 */
	$('#reset-game').on('click', resetGame);

	/**
	 * Select a player
	 */
	$('.choice').on('click', startGame);

	function startGame(){
		var delay = 300;
		PLAYER = $(this).val();

		$('#choose-player').removeClass('in').addClass('out');
		$('#game-container').removeClass('out').addClass('in');

		//if player selected 'O' then they go 2nd
		if(PLAYER === 'O'){
			pTurn = false;

			setTimeout(function(){
				aiTurn();
				endTurn();
			}, delay);

			AI_ADV = X_ADV;
			AI_RISK = O_ADV;
		}else{
			AI_ADV = O_ADV;
			AI_RISK = X_ADV;
		}

/*
		$('#choose-player').fadeOut(delay, function(){
			$('#turn-notice').fadeIn(delay);
			$('#tictactoe-board').fadeIn(delay);

			//if player selected 'O' then they go 2nd
			if(PLAYER === 'O'){
				pTurn = false;
				setTimeout(function(){
					aiTurn();
					endTurn();
				}, delay);
				AI_ADV = X_ADV;
				AI_RISK = O_ADV;
			}else{
				AI_ADV = O_ADV;
				AI_RISK = X_ADV;
			}
		});
*/

	}

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

		$notice.html('Player O: Turn');
	}

	//Display the O svg image
	function displayO(row, col){
		var $svg = $('#square-'+row+'-'+col+' svg'),
			svg = $svg[0];

		$svg.removeClass('open').addClass('piece-o');
		pieceArray[row][col] = O_VALUE;

		var whatPath = oPath.cloneNode(true);
		svg.appendChild(whatPath);

		$notice.html('Player X: Turn');
	}

	/**
	 *  Ends Turn
	 */
	function endTurn(){
		var turnDelay = Math.floor(Math.random() * (1000 - 300 + 1)) + 300;
		WINNER = checkWin();

		//Winner!
		if(WINNER !== false){
			$notice.html(WINNER+' Wins!');

			if(WINNER === 'O'){
				$('.board-square .piece-o').addClass('flip');
			}else{
				$('.board-square .piece-x').addClass('spin');
			}

			return;
		}

		//Did we run out of turns?
		if(currentTurn === 9){
			$notice.html('DRAW!!');
			return;
		}

		//No Winner this round, next turn;
		pTurn = !pTurn;
		currentTurn++;

		//take next turn
		if(PLAYERS === 1 && !pTurn){
			//humans are so slow. Let's make the computer pretend it is thinking

			setTimeout(function(){
				aiTurn();
				endTurn();
			}, turnDelay);

		}

	}

	function displayAI(row,col){
		if(PLAYER === 'X'){
			displayO(row,col);
		}else{
			displayX(row,col);
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
			displayAI(1,1);
			return;
		}else if(pieceArray[1][2] + pieceArray[2][1] === X_VALUE + X_VALUE && pieceArray[2][2] === 0){
			//right center and bottom center trap.
			displayAI(2,2);
			return;
		}
		else if(pieceArray[0][0] + pieceArray[2][2] === X_VALUE + X_VALUE && pieceArray[1][0] === 0){
			//opposite corner attacks
			displayAI(1,0);
			return;
		}
		else if(pieceArray[2][0] + pieceArray[0][2] === X_VALUE + X_VALUE && pieceArray[1][2] === 0){
			displayAI(1,2);
			return;
		}


		//Check advantage first
		for(var row = 0; row < pieceArray.length; row++){
			countPieces(row);

			//Check our columns for adv and risk
			if (advantage(colSum)) {
				//this column is in trouble, find an open space!
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[col][row] === 0){
						//Open!
						displayAI(col,row);
						return;
					}
				}
			}

			//Check our rows for adv and risk
			if (advantage(rowSum)) {
				//this row is in trouble, find an open space!
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[row][col] === 0){
						//Open!
						displayAI(row,col);
						return;
					}
				}
			}

			//ltr or top to bottom diagonal, [0,0],[1,1][2,2]
			if (advantage(ltrDiagSum)) {
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[col][col] === 0){
						//Open!
						displayAI(col,col);
						return;
					}
				}
			}

			//rtl or bottom to top diagonal, [2,0],[1,1][0,2]
			if (advantage(rtlDiagSum)) {
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[pieceArray[row].length-col-1][col] === 0){
						//Open!
						displayAI(pieceArray[row].length-col-1,col);
						return;
					}
				}
			}

		}

		//Check for risks next
		for(var row = 0; row < pieceArray.length; row++){
			countPieces(row);

			//Check our columns for adv and risk
			if (risk(colSum)) {
				//this column is in trouble, find an open space!
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[col][row] === 0){
						//Open!
						displayAI(col,row);
						return;
					}
				}
			}

			//Check our rows for adv and risk
			if (risk(rowSum)) {
				//this row is in trouble, find an open space!
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[row][col] === 0){
						//Open!
						displayAI(row,col);
						return;
					}
				}
			}

			//ltr or top to bottom diagonal, [0,0],[1,1][2,2]
			if (risk(ltrDiagSum)) {
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[col][col] === 0){
						//Open!
						displayAI(col,col);
						return;
					}
				}
			}

			//rtl or bottom to top diagonal, [2,0],[1,1][0,2]
			if (risk(rtlDiagSum)) {
				for(var col = 0; col < pieceArray[row].length; col++){
					if(pieceArray[pieceArray[row].length-col-1][col] === 0){
						//Open!
						displayAI(pieceArray[row].length-col-1,col);
						return;
					}
				}
			}

		}

		//go through the corners and place a piece.
		// I think the corners are the best place if no other spot has an advantage or risk
		if(pieceArray[0][0] === 0){
			displayAI(0,0);
			return;
		}
		if(pieceArray[0][2] === 0){
			displayAI(0,2);
			return;
		}
		if(pieceArray[2][0] === 0){
			displayAI(2,0);
			return;
		}
		if(pieceArray[2][2] === 0){
			displayAI(2,2);
			return;
		}

		//Just find the first open place so we do something.
		//I do not think the AI should ever make it here, but just in case.
		for(var row = 0; row < pieceArray.length; row++){
			for(var col = 0; col < pieceArray[row].length; col++){
				if(pieceArray[row][col] === 0){
					displayAI(row,col);
					return;
				}
			}
		}

	}

	function advantage(value){
		if (value === AI_ADV) {
			return true
		}

		return false;
	}

	function risk(value){
		if (value === AI_RISK ) {
			return true
		}

		return false;
	}

	function advOrRisk(value){
		if (value === AI_ADV || value === AI_RISK ) {
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
		PLAYER = '';
		AI_ADV = 0;
		AI_RISK = 0;

		var piece = null,
			delay = 300;

		$('#choose-player').removeClass('out').addClass('in');
		$('#game-container').removeClass('in').addClass('out');

		clearBoard();
/*
		$('#tictactoe-board,#turn-notice ').fadeOut(delay, function(){
			$('#choose-player').fadeIn(delay,function(){
				clearBoard();
			});
		});
*/
	}

	function clearBoard(){
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

		$notice.html('Player X: Turn');
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
