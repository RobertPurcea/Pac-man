import Map from './Map';
import {
	clear,
	collide
} from './utility';

const Game = (backgroundCanvas, foregroundCanvas) => {
	const state = {
		score: 0,
	};

	return Object.assign({}, {

		initialize() {
			foregroundCanvas.width = backgroundCanvas.width = 690;
			foregroundCanvas.height = backgroundCanvas.height = 650;

			state.map = Map(backgroundCanvas, foregroundCanvas);

			state.map.drawStatic();
			state.map.drawDinamic();

			// set pacman
			const pacman = state.map.getPacman();
			pacman.setControls('w', 'd', 's', 'a');
			pacman.state.destination = state.map.getNextTile(pacman.state.index, pacman.state.currentDirection);
		},


		move() {
			const pacman = state.map.getPacman();
			const map = state.map;
			const layout = map.getMap();


			/** Update pacman's position or change his destination */
			if (!pacman.isStuck() && pacman.reachDestination()) {
				/** Move pacman in the map array to the current position */

				// remove pacman from the last tile
				layout[pacman.state.index].dinamic = layout[pacman.state.index].dinamic.filter(el => !(el.state && el.state.type === 'C'));
				// update pacman index
				pacman.state.index = pacman.state.destination.static.index;
				// add pacman to the current tile
				layout[pacman.state.index].dinamic.push(pacman);


				/** If the user changes the direction, and it is VALID(no impassable terrain), pacman will follow that direction */

				const userDirectionNextTile = map.getNextTile(pacman.state.index, pacman.state.wantedUserDirection);
				if (userDirectionNextTile.static.type !== '#' && userDirectionNextTile.static.type !== '-') {
					pacman.state.currentDirection = pacman.state.wantedUserDirection;
				}


				/**
				 * If the next tile is impassable terrain set pacman.freeze to true, so pacman is no longer able to move further
				 * Else allow pacman to move on his current direction
				 */
				const currentDirectionNextTile = map.getNextTile(pacman.state.index, pacman.state.currentDirection);

				if (currentDirectionNextTile.static.type === '#' || currentDirectionNextTile.static.type === '-') {
					pacman.state.freeze = true;
				} else {
					pacman.state.destination = currentDirectionNextTile;
					pacman.changeDirection();
				}
			} else if (!pacman.isStuck()) {
				pacman.update();
			}

			// ghosts
			// ...
		},

		checkImpact() {
			const pacman = state.map.getPacman();
			const layout = state.map.getMap();

			let redrawStatic = false;

			const isFood = tile => tile.static.type === '*' ? true : false;
			const isGhost = tile => (tile.dinamic.length !== 0 && tile.dinamic.some(tile => tile.state.type === 'M')) ? true : false;


			layout.filter(tile => isFood(tile) || isGhost(tile)).forEach(tile => {

				// test if pacman hits a ghost. End game if he does
				if (tile.dinamic.length) {
					var pacmanHitGhost;

					// test if the any of the dinamic elements from this tile hits pacman
					tile.dinamic.forEach(elem => {
						if (elem.state.type === 'M' && collide(pacman.state, elem.state)) {
							return pacmanHitGhost = true;
						}
					});

					if (pacmanHitGhost) console.log('pacman died');
				}

				// remove food when pacman touches it
				if (isFood(tile) && collide(pacman.state, tile.static)) {
					tile.static.type = ' ';
					redrawStatic = true;
				}

			});

			return redrawStatic;
			
		},

		draw(canvas1, canvas2) {
			if (!canvas2) {
				clear({
					foregroundCanvas
				});
			} else {
				clear({
					foregroundCanvas,
					backgroundCanvas
				});
				state.map.drawStatic();
			}
			state.map.drawDinamic();
		},
	});
};

export default Game;


/*

				if (isGhost(el) && collide(pacman.state, el.dinamic[0].state)) {
					alert("end game");
				}
 */
// // When pacman reached his current destination, swap the two objects in the map collection, and update their coordinates and indexes
// if (pacman.state.needsSwap) {
// 	map.swap(pacman.state.index, pacman.state.destination.index);

// 	map.swapIndexes(pacman, pacman.state.destination);

// 	pacman.state.destination.x = pacman.oldX;
// 	pacman.state.destination.y = pacman.oldY;
// }
// remove pacman from the last tile's dinamic array