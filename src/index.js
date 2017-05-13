import "babel-polyfill";
import Game from "./Scripts/Game.js";

if (module.hot) module.hot.accept;
console.clear();


// SETUP 

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");

const game = Game(backgroundCanvas, foregroundCanvas);
game.initialize();

/** Start or pause the game on spacebar keypress */
document.addEventListener('keydown', e => {
	if (e.key === ' ') {
		if (game.isPaused()) {
			game.play(loop);
		} else {
			game.pause();
		}
	}
});


// GAME LOOP

const loop = () => {
	game.movePacman();
	game.moveGhosts();

	if (game.checkImpact()) {
		game.draw('front', 'back');
	} else {
		game.draw('front');
	}

	game.setLoopId(requestAnimationFrame(loop));
};





// game.moveGhosts();