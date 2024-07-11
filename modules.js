function createBoard () {

    // initialize empty gameboard
    const gameBoard = [['','',''],['','',''],['','','']];
    const topText = document.querySelector("#topText");
    // variable for player turn and to decide whether to place an X or O
    let turn = 0;

    // checks for empty spot
    const isOccupied = function (row,column) {
        return (gameBoard[row][column] !== '');
    }

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
    

    // player action
    const playerTurn = function (tile){
        // avoid recomputation of position
        let row = Math.floor((tile - 1) / 3);
        let column = (tile -1) % 3;
        if((turn == 0) && (! isOccupied(row,column))){
            gameBoard[row][column] = 'X';
            turn = 1;
            if(checkWin()){
                topText.textContent = "Player 1 wins!";
                return;
            }
            topText.textContent = "Player 2's Turn (O)";
            return true;
        }
        if((turn == 1) && (! isOccupied(row,column))) {
            gameBoard[row][column] = 'O';
            turn = 0;
            if(checkWin()){
                topText.textContent = "Player 2 wins!";
                return;
            }
            topText.textContent = "Player 1's Turn (X)";
            return true;
        } else {
            return false;
        }

    }

    const clearBoard = function(){
        turn = 0;
        for(let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                gameBoard[i][j] = '';
            }
        }
    }

    return {gameBoard,playerTurn,checkWin,clearBoard};
}

const gameController = function () {
    const tiles = document.querySelectorAll(".tile");
    const board = createBoard();
    const eventhandlers = [];

    const updateBoard = function() {
        for(let i=0; i < 9; i++){
            tiles[i].textContent = board.gameBoard[Math.floor(i / 3)][i % 3];
        }
    }

    const endGame = function (){
        board.clearBoard();
        for (let i = 1; i < 10; i++){
            tiles[i-1].removeEventListener('click', eventhandlers[i]);
        }
    }

    const playTurn = function(tile) {
        if (board.playerTurn(tile) && (! board.checkWin())){
            updateBoard();
        }
        if (board.checkWin()){
            updateBoard();
            endGame();
        }
    }

    function playTurnWrapper (tile) {
        return function() {
            playTurn(tile);
        }
    }

    const startGame = function(){
        document.querySelector("#topText").textContent = "Player 1's Turn (X)";
        for (let i = 1; i < 10; i++){
            // clear board, add event listener
            eventhandlers[i] = playTurnWrapper(i);
            tiles[i-1].textContent = '';
            tiles[i-1].addEventListener('click', eventhandlers[i]);
        }
    }

    return {startGame};
}

export {gameController};