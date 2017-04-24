import "babel-polyfill";
if (module.hot) module.hot.accept;
console.clear();

/** 
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


// import {random, round, almostIntersect} from "./Scripts/utility.js";
// import Map from "./Scripts/Map.js";
// import Pacman from "./Scripts/Pacman.js";
import Game from "./Scripts/Game.js";



// SETUP 

const backgroundCanvas = document.querySelector("#background");
const foregroundCanvas = document.querySelector("#foreground");

const game = Game( backgroundCanvas, foregroundCanvas );

game.initialize();




game.move();


const loop = () => {
	game.move();


	game.draw();
	id = requestAnimationFrame(loop);
};






let id = requestAnimationFrame(loop);

setTimeout(() => {
	cancelAnimationFrame(id);
}, 20000);


// console.log(pDestination, pState, pacman.state.destination);
// const loop = () => {

// 	console.log(pacman.reachDestination());

// 	if ( pacman.reachDestination() && !pState.stuck ) {

// 		// update states the first time pacman got into a new position
// 		if ( pState.needsSwap ) {
// 			map.swap( pState.index, pDestination.index );

// 			map.swapIndexes ( pState, pDestination);

// 			pDestination.x = pDestination.newX;
// 			pDestination.y = pDestination.newY;
// 		}
		
// 		//return;

// 		if ( map.getNextTile(pacman) === "#" ) { // freeze
// 			pState.stuck = true;
// 			pState.needsSwap = false;
// 		} else {
// 			pDestination = map.getNextTile( pacman );
// 			pState.stuck = false;
// 			pState.needsSwap = true;
// 		}

// 	} else if ( !pState.stuck ) {
// 		pacman.update();

// 	}
	
// 	map.drawDinamic();
	
// 	id = requestAnimationFrame(loop);
// };

// let id = requestAnimationFrame(loop);


// pacman.pDestination.targetX = pacman.coordinates[0];
// pacman.pDestination.targetY = pacman.coordinates[1];

	// if ( almostIntersect( pState.x, pacman.state.y, pacman.state.pDestination.x, pacman.state.pDestination.y ) ) {
	// 	map.setValue(pacman, pacman.pDestination.index);
	// 	map.setValue(pacman.pDestination,pacman.index);
		
	// 	const tmp = pacman.index;
	// 	pacman.index = pacman.pDestination.index;
	// 	pacman.pDestination.index = tmp;

	// 	pacman.pDestination.x = pacman.pDestination.targetX;
	// 	pacman.pDestination.y = pacman.pDestination.targetY;


	// 	// wall or map margin ahead 
	// 	if (!((map.getNextTile(pacman).type === "#") || (map.getNextTile(pacman) === null))) {
	// 		pacman.pDestination = map.getNextTile(pacman);
	// 		pacman.pDestination.targetX = pacman.coordinates[0];
	// 		pacman.pDestination.targetY = pacman.coordinates[1];
	// 		console.log("!!");
	// 	}
	// } else if ( pacman.state.direction !== freezeDirection ) {
			
	// }
	// 	pacman.update();



