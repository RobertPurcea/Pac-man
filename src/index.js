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


import {random, round, almostIntersect} from "./Scripts/utility.js";
import Map from "./Scripts/Map.js";
import Pacman from "./Scripts/Pacman.js";



// setup canvas

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");
const backgroundCtx = backgroundCanvas.getContext("2d");
const foregroundCtx = foregroundCanvas.getContext("2d");

foregroundCanvas.width = backgroundCanvas.width = 690;
foregroundCanvas.height = backgroundCanvas.height = 650;















const map = Map(backgroundCanvas, foregroundCanvas);
const pacman = map.getPacman();

map.drawStatic();
pacman.setControls("w","d","s","a");
pacman.destination = map.getNextTile(pacman);




const loop = () => {

	if ( pacman.reachDestination() && !pacman.state.stuck ) {

		// update states the first time pacman got into a new position
		if ( pacman.state.needsSwap ) {
			map.swap( pacman.state.index, pacman.state.destination.index );
			map.swapIndexes ( pacman.state, pacman.state.destination);
			
		}


	} 
	
	map.drawDinamic();
	
	id = requestAnimationFrame(loop);
};

let id = requestAnimationFrame(loop);

setTimeout(() => {
	cancelAnimationFrame(id);
}, 5000);

// pacman.destination.targetX = pacman.coordinates[0];
// pacman.destination.targetY = pacman.coordinates[1];

	// if ( almostIntersect( pacman.state.x, pacman.state.y, pacman.state.destination.x, pacman.state.destination.y ) ) {
	// 	map.setValue(pacman, pacman.destination.index);
	// 	map.setValue(pacman.destination,pacman.index);
		
	// 	const tmp = pacman.index;
	// 	pacman.index = pacman.destination.index;
	// 	pacman.destination.index = tmp;

	// 	pacman.destination.x = pacman.destination.targetX;
	// 	pacman.destination.y = pacman.destination.targetY;


	// 	// wall or map margin ahead 
	// 	if (!((map.getNextTile(pacman).type === "#") || (map.getNextTile(pacman) === null))) {
	// 		pacman.destination = map.getNextTile(pacman);
	// 		pacman.destination.targetX = pacman.coordinates[0];
	// 		pacman.destination.targetY = pacman.coordinates[1];
	// 		console.log("!!");
	// 	}
	// } else if ( pacman.state.direction !== freezeDirection ) {
			
	// }
	// 	pacman.update();



