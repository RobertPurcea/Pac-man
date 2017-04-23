import "babel-polyfill";
if (module.hot) module.hot.accept;
console.clear();

import {random, round} from "./Scripts/utility.js";
import Map from "./Scripts/map.js";
// import PacMan from "./Scripts/Pacman.js";

// setup canvas

const backgroundCanvas = document.querySelector("#background");
const backgroundCtx = backgroundCanvas.getContext("2d");
const foregroundCanvas = document.querySelector("#foreground");
const foregroundCtx = foregroundCanvas.getContext("2d");

foregroundCanvas.width = backgroundCanvas.width = window.innerWidth;
foregroundCanvas.height = backgroundCanvas.height = window.innerHeight;


const map = Map(backgroundCanvas, foregroundCanvas);
map.getMap();
map.drawStatic();
map.drawDinamic();



// let pacman = PacMan();
// pacman.setControls("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft");

// // LOOP
// const loop = () => {
// 	pacman.draw();
// 	pacman.update();
	
// 	id = requestAnimationFrame(loop);
// };

// let id = requestAnimationFrame(loop);

// setTimeout(() => {
// 	cancelAnimationFrame(id);
// }, 5000);