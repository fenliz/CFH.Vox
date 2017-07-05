import { Game } from "./Engine/Game";

let game: Game;

window.onload = () => {
    game = new Game(1024, 800);
    game.start();
};
