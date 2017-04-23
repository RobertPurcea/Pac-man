import "babel-polyfill";
if (module.hot) module.hot.accept;
console.clear();

/**
 * Situational: In MAP, access to pacman
 * Access to map array, in Pacman
 * Based on indexes, be able to modify the map from outside
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


import {random, round} from "./Scripts/utility.js";
import Map from "./Scripts/Map.js";
import Pacman from "./Scripts/Pacman.js";


// setup canvas

const backgroundCanvas = document.querySelector("#background");
const backgroundCtx = backgroundCanvas.getContext("2d");
const foregroundCanvas = document.querySelector("#foreground");
const foregroundCtx = foregroundCanvas.getContext("2d");

foregroundCanvas.width = backgroundCanvas.width = window.innerWidth;
foregroundCanvas.height = backgroundCanvas.height = window.innerHeight;


const map = Map(backgroundCanvas, foregroundCanvas);
const pacman = map.getPacman();

map.drawStatic();



// LOOP
const loop = () => {

	map.drawDinamic();

	id = requestAnimationFrame(loop);
};

let id = requestAnimationFrame(loop);

setTimeout(() => {
	cancelAnimationFrame(id);
}, 5000);

setTimeout(() => {
	map.setValue(10, {value : "www"});
	console.log(map.getValue(10));
}, 2000);







	// pacman.update();


// const pacman = map.getPacman();
// pacman.setControls("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft");