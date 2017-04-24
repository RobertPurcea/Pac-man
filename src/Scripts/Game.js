//import {random, round, almostIntersect} from "./Scripts/utility.js";
//import Pacman from "./Scripts/Pacman.js";
import Map from "./Map.js";


const Game = (backgroundCanvas, foregroundCanvas) => {

	const backgroundCtx = backgroundCanvas.getContext("2d");
	const foregroundCtx = foregroundCanvas.getContext("2d");

	const state = {

	};

	return Object.assign({}, {

		initialize () {
			foregroundCanvas.width = backgroundCanvas.width = 690;
			foregroundCanvas.height = backgroundCanvas.height = 650;

			state.map = Map(backgroundCanvas, foregroundCanvas);
			state.pacman = state.map.pacman;

			state.map.drawStatic();
			state.map.drawDinamic();
			state.pacman.setControls( "w","d","s","a" );
			state.pacman.destination = state.map.getNextTile( state.pacman );
		},

		draw () {
			state.map.drawDinamic();
		},

		move () {
			const pacman = state.pacman;
			const pState = pacman.state; // less writing

			if ( !pState.stuck && pacman.reachDestination() ) {
				
				// UPDATE INFO for pacman and it's destination tile
				if ( pState.needsSwap ) {
					state.map.swap( pState.index, pState.destination.index );

					state.map.swapIndexes ( pacman, pState.destination);

					pState.destination.x = pacman.oldX;
					pState.destination.y = pacman.oldY;
				}

				// && pacman current direction 
				if ( state.map.getNextTile( pacman ).type === "#" ) {
					pState.stuck = true;
					pState.needsSwap = false;
					pState.reached = true;

				} else {
					pState.stuck = false;
					pState.needsSwap = true;
					pState.reached = false;
					pState.destination = state.map.getNextTile( pacman );
					pacman.changeDirection();
				}
			} else if ( !pState.stuck ){
				pacman.update();
			}
		},








		info () {
			console.log(state.pacman);
		}
 
	});
};

export default Game;