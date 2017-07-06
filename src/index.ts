import { Game } from "./Engine/Game";

let game: Game;

window.onload = () => {
    game = new Game(1600, 900);
    game.start();
};
