import "babel-polyfill";
import Game from "./Scripts/Game.js";

if (module.hot) module.hot.accept;
console.clear();



// setup canvas and game interface dimensions 

const gameWidth = 840; // multiple of 28
const gameHeight = 775; // multiple of 31

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");
const cover = document.querySelector("#cover");

cover.style.width = gameWidth + "px";
cover.style.height = gameHeight + "px";

foregroundCanvas.width = backgroundCanvas.width = gameWidth;
foregroundCanvas.height = backgroundCanvas.height = gameHeight;




// initialize game 

let game = Game(backgroundCanvas, foregroundCanvas);

game.initialize();

/** Allow pausing/resuming the game by pressing spacebar*/
document.addEventListener('keydown', e => {
	if (e.key === ' ') {
		if (game.isPaused()) {
			game.play(loop);
		} else {
			game.pause();
		}
	}
});


// game loop

const loop = () => {
	// call loop async
	game.setLoopId(requestAnimationFrame(loop));

	// move pacman and ghosts
	game.movePacman();
	game.moveGhosts();

	// check if pacman collides with any element
	game.actOnCollision();

	if (game.isFrozen()) {
		setTimeout(() => {
			if (game.needsStaticRedraw()) {
				game.draw('front', 'back');
			} else {
				game.draw('front');
			}

			/** Create a new game by overwriting the existing game object */
			if (game.noLivesLeft()) {
				newGame();
			}
		}, 1000);
	} else {
		if (game.needsStaticRedraw()) {
			game.draw('front', 'back');
		} else {
			game.draw('front');
		}

		/** Create a new game by overwriting the existing game object */
		if (game.noLivesLeft()) {
			newGame();
		}
	}

};

/** Create a new game by overwriting the existing game object */
function newGame() {
	game.pause();
	game.removeKeyHandler();

	game = Game(backgroundCanvas, foregroundCanvas);
	game.initialize();
}