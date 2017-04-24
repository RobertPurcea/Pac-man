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
			
			// 
			if ( !pState.stuck && pacman.reachDestination() ) {
				
				// When pacman reached his current destination, swap the two objects in the map collection, and update their coordinates and indexes
				if ( pState.needsSwap ) {
					state.map.swap( pState.index, pState.destination.index );

					state.map.swapIndexes ( pacman, pState.destination);

					pState.destination.x = pacman.oldX;
					pState.destination.y = pacman.oldY;
				}
				

				// If the user changes the direction, and it is VALID(no wall upfront), pacman will follow that direction
				if ( ( pState.userDirection !== pState.validDirection ) && ( state.map.getNextTile( pacman, "user").type !== "#" && 
				state.map.getNextTile( pacman, "user").type !== "-" ) ) {
					pState.validDirection = pState.userDirection;
				}

				
				// If the next tile is a wall, freeze pacman until his direction is changed 
				if ( state.map.getNextTile( pacman ).type === "#" || state.map.getNextTile( pacman ).type === "-") {
					
					pState.stuck = true;
					pState.needsSwap = false;
					pState.reachedDestination = true;
					
				} else {
					//	ELSE update the direction and destination to match the next tile in front of pacman and unfreeze him
					
					pState.stuck = false;
					pState.needsSwap = true;
					pState.reachedDestination = false;
					pState.destination = state.map.getNextTile( pacman );
					pacman.changeDirection();
				}
			} else if ( !pState.stuck ){  // update pacman's position
				pacman.update();
			}
		},
	});
};

export default Game;