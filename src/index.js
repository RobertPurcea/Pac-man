import "babel-polyfill";
import Game from "./Scripts/Game.js";

if (module.hot) module.hot.accept;
console.clear();



// SETUP 

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");

let game = Game(backgroundCanvas, foregroundCanvas);
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
	// call loop async
	game.setLoopId(requestAnimationFrame(loop));

	// move pacman and ghosts
	game.movePacman();
	game.moveGhosts();

	// check if pacman collides with any element. Act accordingly
	if (game.checkImpact()) {
		game.draw('front', 'back');
	} else {
		game.draw('front');
	}

	// End game if pacman has no lives left 
	if (game.noLivesLeft()) {
		game.pause();
		game = Game(backgroundCanvas, foregroundCanvas);
		game.initialize();
	}
};