import "./ObjectExtension";
import { Game } from "./by/zimad/Game";

const isMobile = /Mobi/i.test(window.navigator.userAgent);
const documentParent = document.getElementById('game');
const game = new Game(isMobile);
function start() {
    documentParent.appendChild(game.view);
    game.launch();
}

start();