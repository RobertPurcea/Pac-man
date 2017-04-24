import "babel-polyfill"; 
if (module.hot) module.hot.accept;
console.clear();

import Game from "./Scripts/Game.js";



// SETUP 

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");

const game = Game( backgroundCanvas, foregroundCanvas );

game.initialize();

   
	
	
// GAME LOOP

const loop = () => {
	game.move();

	game.draw();
	id = requestAnimationFrame(loop);
};

let id = requestAnimationFrame(loop);







// cancel loop after seconds

setTimeout(() => {
	cancelAnimationFrame(id);
}, 10000);






