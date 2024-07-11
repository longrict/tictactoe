import { gameController } from './modules.js'

document.addEventListener("DOMContentLoaded", () => {
    const game = gameController();
    game.startGame();
    document.querySelector("#restart").addEventListener("click", () => {
        game.startGame();
    })
});