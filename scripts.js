function createBoard () {

    // initialize empty gameboard
    const gameBoard = [['','',''],['','',''],['','','']];

    // variable for player turn and to decide whether to place an X or O
    let turn = 0;

    // checks for empty spot
    const isOccupied = function (row,column) {
        return (gameBoard[row][column] !== '');
    }

    const checkWin = function (){
        for (let i = 0; i < 3; i++){
            // check rows
            if (gameBoard[i][0] === gameBoard[i][1] === gameBoard[i][2]) {
                return true;
            }
            // check columns
            if (gameBoard[0][i] === gameBoard[1][i] === gameBoard[2][i]) {
                return true;
            }
        }
        // check diagonals
        return((gameBoard[0][0] === gameBoard[1][1] === gameBoard[2][2]) 
            || (gameBoard[0][2] === gameBoard[1][1] === gameBoard[2][0]))
    }

    // player action
    const playerTurn = function (tile){
        // avoid recomputation of position
        let row = Math.floor((tile - 1) / 3);
        let column = (tile -1) % 3;
        console.log(`${row} ${column} ${tile}`);
        console.log(gameBoard);
        if((turn == 0) && (! isOccupied(row,column))){
            gameBoard[row][column] = 'X';
            turn = 1;
            if(checkWin()){
                console.log("Player 1 wins!");
            }
            return true;
        }
        if((turn == 1) && (! isOccupied(row,column))) {
            gameBoard[row][column] = 'O';
            turn = 0;
            if(checkWin()){
                console.log("Player 2 wins!");
            }
            return true;
        } else {
            return false;
        }

    }
    return {gameBoard,playerTurn,checkWin,isOccupied};
}

const displayController = function () {
    const tiles = document.querySelectorAll(".tile");
    const board = createBoard();

    const updateBoard = function() {
        for(i=0; i < 9; i++){
            tiles[i].textContent = board.gameBoard[Math.floor(i / 3)][i % 3];
        }
    }

    const playTurn = function(tile) {
        if (board.playerTurn(tile) && (! board.checkWin())){
            updateBoard();
        }
    }

    return {playTurn};
}

document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll(".tile");
    const game = displayController();
    for (let i = 1; i < 10; i++){
        tiles[i-1].addEventListener('click', () => game.playTurn(i));
    }
});