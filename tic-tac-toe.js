var turn = 'X';

var selections = new Array();
selections['X'] = [0,0,0,0,0,0,0,0,0];
selections['O'] = [0,0,0,0,0,0,0,0,0];

var total_turns_played = 0;

var with_computer = true;
var optional_selections_for_computer = [0,0,0,0,0,0,0,0,0];

var scores = new Array(); 
	scores['X'] = 0;
	scores['O'] = 0;

//[0,1,2]
//[3,4,5]
//[6,7,8]
var win_patterns =  [
	[1,1,1,0,0,0,0,0,0], // [0,1,2]
	[0,0,0,1,1,1,0,0,0], // [3,4,5]
	[0,0,0,0,0,0,1,1,1], // [6,7,8]
	[1,0,0,1,0,0,1,0,0], // [0,3,6]
	[0,1,0,0,1,0,0,1,0], // [1,4,7]
	[0,0,1,0,0,1,0,0,1], // [2,5,8]
	[1,0,0,0,1,0,0,0,1], // [0,4,8]
	[0,0,1,0,1,0,1,0,0], // [2,4,6]
];

function generateGame(){
	turn = 'X';
	
	selections['X'] = [0,0,0,0,0,0,0,0,0];
	selections['O'] = [0,0,0,0,0,0,0,0,0];

	total_turns_played = 0;

	with_computer = true;
	optional_selections_for_computer = [0,0,0,0,0,0,0,0,0];

	// is auto player selected 
	auto_player = document.getElementById('with_computer'); 
	if (auto_player.checked === true) with_computer = true; 
	else  with_computer = false;


	// Clearing board for new game
	document.getElementById('game-board').innerHTML = '';
	
	var unique_id = 0;
	
	// Generating board
	for (row=0; row<3; row++){
		for (col=0; col<3; col++) {
			var unique_name = 'grid-'+unique_id;
			var button = document.createElement("input");
			button.setAttribute("value", ' ');
			button.setAttribute("id", unique_id);
			button.setAttribute("name", unique_name);
			button.setAttribute("class", 'grid-cell');
			button.setAttribute("type", 'button');
			button.setAttribute("onclick", "markCheck(this)");
			document.getElementById('game-board').appendChild(button);
			unique_id++;
		}
		var breakline = document.createElement("br");
			document.getElementById('game-board').appendChild(breakline);
	}

}

function markCheck(obj){
	obj.value = turn;

	total_turns_played++;

	var cell = Number(obj.id);
	selections[turn][cell] = 1;
	optional_selections_for_computer[cell] = 1;

	if (turn == 'X' ) {
		obj.setAttribute("class", 'green-player');
	} else {
		obj.setAttribute("class", 'red-player');
	}

	obj.setAttribute("disabled", 'disabled');
	checkPlayerHasWinningPattern();
	changeTurn();
}

function changeTurn(){
	if (turn == 'X') {
		turn = 'O';

		// if auto player selected
		if (with_computer===true) autoTurn();
	}
	else turn = 'X';
}

function autoTurn() {
	available_cells = []

	// find available indexes
	for(var i=0; i< optional_selections_for_computer.length; i++){
		if (optional_selections_for_computer[i] == 0){
			available_cells.push(i);
		} 
	}

	// choose randomly where to mark check
	var chosen_cell = available_cells[Math.floor(Math.random() * available_cells.length)];//8
	var desired_obj = document.getElementById(chosen_cell);
	markCheck(desired_obj);
}

// Checking winner of selected type on selection
function checkPlayerHasWinningPattern() {
	gameOver = false;
	player_selections = selections[turn];
	for (var p=0; p < win_patterns.length; p++) {
		gameOver = isContainingThisWinningPattern(player_selections, win_patterns[p]);

		if ( gameOver === true ) {

			// On winning disabled all boxes
			disableAllBoxes();

			alert('Player '+turn+' Won !!');

			// Updating score card
			scoreUpdate(turn);

			// to avoid additional mark check after X wins
			with_computer = false;
			
			break;
		} 
	}

	// If no one wins; declare DRAW
	if ( ( total_turns_played == 3*3 ) && gameOver === false ) { 
		alert('Game Draw!');
		gameOver = true;
		disableAllBoxes(); 
	}
}


// Verifying player's selections with a winning pattern
function isContainingThisWinningPattern(player_selections, win_pattern){
	var match = 0;
	for (var i=0; i < 9; i++) {
		if(player_selections[i] + win_pattern[i] == 2){
			match ++;
		}
	}

	if (match == 3){
		return true;
	}

	return false;
}

// Disable all cells after winning/draw
function disableAllBoxes() {

	var elements = document.getElementsByClassName("grid-cell");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].disabled =true;
	}
}

// Update the players' score
function scoreUpdate(turn){
	scores[turn]++;
	document.getElementById('score-'+turn).innerHTML = scores[turn];
}