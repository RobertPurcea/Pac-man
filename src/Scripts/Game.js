import Map from './Map';
import { clear } from './utility';

const Game = (backgroundCanvas, foregroundCanvas) => {
	const state = {

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

			// console.log(pacman.info());


			if (!pacman.isStuck() && pacman.reachDestination()) {
				/**
				 * Remove pacman from the last tile's dinamic
				 *	Update pacman's index
				 *	Add pacman to current tile's dinamic array
				 */
				// remove pacman from the tile at the current index
				layout[pacman.state.index].dinamic = layout[pacman.state.index].dinamic.filter(el => !(el.state && el.state.type === 'C'));
				// update pacman index
				pacman.state.index = pacman.state.destination.static.index;
				// add pacman to the tile at the current index(now updated)
				layout[pacman.state.index].dinamic.push(pacman);


				/** If the user changes the direction, and it is VALID(no wall or ghost gate upfront), pacman will follow that direction */
				const userDirectionNextTile = map.getNextTile(pacman.state.index, pacman.state.wantedUserDirection);
				if (userDirectionNextTile.static.type !== '#' && userDirectionNextTile.static.type !== '-') {
					pacman.state.currentDirection = pacman.state.wantedUserDirection;
				}

				
				// If the next tile is a wall, freeze pacman until his direction is changed
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
		},

		draw() {
			clear({ foregroundCanvas });
			state.map.drawDinamic();
		},
	});
};

export default Game;

				// // When pacman reached his current destination, swap the two objects in the map collection, and update their coordinates and indexes
				// if (pacman.state.needsSwap) {
				// 	map.swap(pacman.state.index, pacman.state.destination.index);

				// 	map.swapIndexes(pacman, pacman.state.destination);

				// 	pacman.state.destination.x = pacman.oldX;
				// 	pacman.state.destination.y = pacman.oldY;
				// }
				// remove pacman from the last tile's dinamic array