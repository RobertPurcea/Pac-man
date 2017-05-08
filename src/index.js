import "babel-polyfill"; 
import Game from "./Scripts/Game.js";

if (module.hot) module.hot.accept;
console.clear();


// SETUP 

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");

const game = Game(backgroundCanvas, foregroundCanvas);
game.initialize();


// GAME LOOP

const loop = () => {
	game.movePacman();
	game.moveGhosts();

	if (game.checkImpact()) {
		game.draw('front', 'back');
	} else {
		game.draw('front');
	}

	id = requestAnimationFrame(loop);
};

let id = requestAnimationFrame(loop);


// cancel loop after seconds

setTimeout(() => {
	cancelAnimationFrame(id);
}, 20000);
