import Map from './Map';
import {
	clear,
	collide,
	oppositeDirection,
	distance
} from './utility';


const Game = (backgroundCanvas, foregroundCanvas) => {
	const state = {
		score: 0,
		directions: ['right', 'left', 'down', 'up']
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

			// set ghosts
			const ghosts = state.map.getGhosts();
			ghosts.forEach(ghost => {
				ghost.state.destination = state.map.getNextTile(ghost.state.index, ghost.state.direction);
			});
		},


		movePacman() {
			const pacman = state.map.getPacman();
			const map = state.map;
			const layout = map.getMap();


			/** Update pacman's position or change his destination */
			if (!pacman.isStuck() && pacman.reachDestination()) {
				/** Move pacman in the map array to the current position */

				// remove pacman from the last tile
				layout[pacman.state.index].dinamic = layout[pacman.state.index].dinamic.filter(el => !(el.state.type === 'C'));
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
				pacman.updatePosition();
				pacman.updateAnimation();
			}

			// ghosts
			// ...
		},

		moveGhosts() {
			const map = state.map;
			const layout = map.getMap();
			const ghosts = map.getGhosts();

			ghosts.forEach(ghost => {
				if (ghost.reachDestination()) {

					// update ghost in the main game collection(map array)

					// remove from the last tile
					layout[ghost.state.index].dinamic = layout[ghost.state.index].dinamic.filter(el => !(el.state.type === 'M'));

					// update ghost index
					ghost.state.index = ghost.state.destination.static.index;

					// add ghost to the current tile
					layout[ghost.state.index].dinamic.push(ghost);





					// retrieve all the tiles that are not walls, in front of the ghost(all directions except in the back)

					let possibleDirections = state.directions.filter(el => el !== oppositeDirection(ghost.state.direction));
					let possiblePaths = [];

					possibleDirections.forEach(direction => {
						let tile = map.getNextTile(ghost.state.index, direction);
						if (tile.static.type !== '#' && tile.static.type !== '-') {
							possiblePaths.push({
								tile,
								direction
							});
						}
					});




					/** If there is only one possible way ahead continue on the current path(a ghost cannot turn in the opposite direction) */
					if (possiblePaths.length === 1) {
						ghost.state.destination = possiblePaths[0].tile;
						ghost.state.direction = possiblePaths[0].direction;
						ghost.changeDirection();
					}


					// !!!!!!!!! ghost.state.target is null
					/** If the ghost is in an intersection, the path taken depends on the ghost type and wheather or not it chases pacman */
					if (possiblePaths.length > 1) {
						let shortestDistanceToPacman;
						let nextPath;

						possiblePaths.forEach(path => {
							const distanceToTarget = distance(ghost.state.target, path.tile.static);

							shortestDistanceToPacman = shortestDistanceToPacman || distanceToTarget;
							nextPath = nextPath || path; 

							if (distanceToTarget < shortestDistanceToPacman) {
								shortestDistanceToPacman = distanceToTarget;
								nextPath = path;
							}
						});

						ghost.state.destination = nextPath.tile;
						ghost.state.direction = nextPath.direction;
						ghost.changeDirection();
					}



				} else {
					ghost.updatePosition();
				}
			});

		},


		// collision checking between pacman and every food element or ghost in the game
		checkImpact() {
			const pacman = state.map.getPacman();
			const layout = state.map.getMap();

			// determine if the background canvas should be redrawn
			let redrawStatic = false;

			layout.forEach(tile => {

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

				// test if pacman hits a tile with food. Remove food and set redrawStatic = true if he does
				if (tile.static.type === '*' && collide(pacman.state, tile.static)) {
					tile.static.type = ' ';
					redrawStatic = true;
					state.score++;
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


/*			// const isFood = tile => tile.static.type === '*' ? true : false;
			// const isGhost = tile => (tile.dinamic.length !== 0 && tile.dinamic.some(tile => tile.state.type === 'M')) ? true : false;

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