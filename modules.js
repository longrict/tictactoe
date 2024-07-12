function createBoard () {

    // initialize empty gameboard
    const gameBoard = [['','',''],['','',''],['','','']];

    // variable for player turn and to decide whether to place an X or O
    let turn = 1;

    // checks for empty spot
    const isOccupied = function (row,column) {
        return (gameBoard[row][column] !== '');
    }

    // check for 3 consecutive X's or O's
    const checkWin = function () {
        for (let i = 0; i < 3; i++) {
            // check rows
            if (gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][1] === gameBoard[i][2] && gameBoard[i][0] !== '') {
                return true;
            }
            // check columns
            if (gameBoard[0][i] === gameBoard[1][i] && gameBoard[1][i] === gameBoard[2][i] && gameBoard[0][i] !== '') {
                return true;
            }
        }
        // check diagonals
        if ((gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2] && gameBoard[0][0] !== '') || 
            (gameBoard[0][2] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][0] && gameBoard[0][2] !== '')) {
            return true;
        }
        return false;
    }

    // draw iff there are no more empty spots and neither player has won
    const checkDraw = function() {
        for(let i=0; i < 3; i++){
            for(let j=0; j < 3; j++){
                if(gameBoard[i][j] == ''){
                    return false;
                }
            }
        }
        return true;
    }

    // player action
    const playerTurn = function (tile){
        // avoid recomputation of position
        let row = Math.floor((tile - 1) / 3);
        let column = (tile -1) % 3;

        // valid move iff requested spot is unoccupied, return player that last changed the board or false if invalid move
        if((turn == 1) && (! isOccupied(row,column))){
            gameBoard[row][column] = 'X';
            turn = 2;
            return 1;
        }
        if((turn == 2) && (! isOccupied(row,column))) {
            gameBoard[row][column] = 'O';
            turn = 1;
            return 2;

        } else {
            return false;
        }

    }

    // clear out gameBoard array in preparation for new round
    const clearBoard = function(){
        turn = 1;
        for(let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                gameBoard[i][j] = '';
            }
        }
    }

    return {gameBoard,playerTurn,checkWin,checkDraw, clearBoard};
}

const gameController = function () {
    const tiles = document.querySelectorAll(".tile");
    const board = createBoard();
    const eventHandlers = [];

    // update HTML to reflect player action and change text above board accordingly
    const updateBoard = function(topText) {
        for(let i=0; i < 9; i++){
            tiles[i].textContent = board.gameBoard[Math.floor(i / 3)][i % 3];
            tiles[i].style.color = (tiles[i].textContent === 'X') ? 'rgb(0, 119, 255)' : 'rgb(218, 69, 69)';
        }
        document.querySelector("#topText").textContent = topText;
    }

    // remove event handlers on tiles to stop further player action
    const endGame = function (){
        board.clearBoard();
        for (let i = 1; i < 10; i++){
            tiles[i-1].removeEventListener('click', eventHandlers[i]);
        }
    }

    // perform player action (if valid) and update game state accordingly to reflect result of action
    const playTurn = function(tile) {
        let validMove = board.playerTurn(tile);
        let text;
        if (validMove){
            text = (validMove === 1) ? "Player 2's Turn (O)" : "Player 1's Turn (X)";          
            updateBoard(text);
        }
        if (board.checkWin()){
            text = (validMove === 1) ? "Player 1 Wins!" : "Player 2 Wins!";
            updateBoard(text);
            endGame();
        }
        if (board.checkDraw()){
            updateBoard("Draw!");
            endGame();
        }
    }

    // wrapper function to pass playTurn with argument to event handler
    function playTurnWrapper (tile) {
        return function() {
            playTurn(tile);
        }
    }

    // start game by adding event handlers
    const startGame = function(){
        document.querySelector("#topText").textContent = "Player 1's Turn (X)";
        for (let i = 1; i < 10; i++){
            // clear board, add event listener
            eventHandlers[i] = playTurnWrapper(i);
            tiles[i-1].textContent = '';
            tiles[i-1].addEventListener('click', eventHandlers[i]);
        }
    }

    return {startGame};
}

export {gameController};