import "babel-polyfill";
import Game from "./Scripts/Game.js";

if (module.hot) module.hot.accept;
console.clear();


// SETUP 

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");

const game = Game(backgroundCanvas, foregroundCanvas);
game.initialize();

let gameLoopId;

/** Start or pause the game on spacebar keypress */
document.addEventListener('keydown', e => {
	if (e.key === ' ') {
		if (!gameLoopId) {
			gameLoopId = requestAnimationFrame(loop);
		} else {
			cancelAnimationFrame(gameLoopId);
			gameLoopId = false;
		}
	}
});


// GAME LOOP

const loop = () => {
	game.movePacman();

	if (game.checkImpact()) {
		game.draw('front', 'back');
	} else {
		game.draw('front');
	}

	gameLoopId = requestAnimationFrame(loop);
};





// game.moveGhosts();