import { Game } from "./Engine/Game";

let game: Game;

window.onload = () => {
    game = new Game(1300, 766);
    game.start();
};
