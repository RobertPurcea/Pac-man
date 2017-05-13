import Map from './Map';
import {
	clear,
	collide,
	oppositeDirection,
	distance,
	count
} from './utility';

/** Remove a dinamic element from it's current tile, and add it to it's destination's tile(modifying it's index too) */
function updateInArray(element, layout, condition) {
	// remove from the last tile
	layout[element.state.index].dinamic = layout[element.state.index].dinamic.filter(el => condition(el));

	// update element index
	element.state.index = element.state.destination.static.index;

	// add element to the current tile
	layout[element.state.index].dinamic.push(element);
}

/** Retrieve all the possible next tiles(no walls) and the direction they are in 
 * A tile and the direction it is in will be abstracted in a path object with a tile and direction property)
 */
function getPossiblePaths(element, map, directions) {
	let possiblePaths = [];

	// all directions except the opposite of the current ghost direction 
	let possibleDirections = directions.filter(el => el !== oppositeDirection(element.state.direction));

	possibleDirections.forEach(direction => {
		let tile = map.getNextTile(element.state.index, direction);
		if (tile.static.type !== '#') {
			possiblePaths.push({
				tile,
				direction
			});
		}
	});

	return possiblePaths;
}

/** If pacman has eaten a certain number of food tiles, release additional ghosts
 * Set freeze to false and stop the eye movement
 */
function releaseGhosts(score, maxScore, ghosts) {
	if (
		(score >= maxScore / 8 && (count(ghosts, ghost => ghost.state.frozen) === 2)) ||
		(score >= maxScore / 5 && (count(ghosts, ghost => ghost.state.frozen) === 1))
	) {
		const ghost = ghosts.find(ghost => ghost.state.frozen);
		ghost.state.frozen = false;
		ghost.toggleRandomEyeMovement();
	}
}



const Game = (backgroundCanvas, foregroundCanvas) => {
	const state = {
		score: 0,
		lives: 3,
		loopId: null
	};
	const directions = ['right', 'left', 'down', 'up'];

	return Object.assign({}, {

		initialize() {
			foregroundCanvas.width = backgroundCanvas.width = 700; // original: 
			foregroundCanvas.height = backgroundCanvas.height = 651;

			state.map = Map(backgroundCanvas, foregroundCanvas, "darkblue");

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
				ghost.toggleRandomEyeMovement();
				ghost.state.target = pacman;
			});
		},

		movePacman() {
			const pacman = state.map.getPacman();
			const map = state.map;
			const layout = map.getMap();





			/** Update pacman's position or change his destination */
			if (!pacman.isStuck() && pacman.reachDestination()) {

				/** Move pacman in the map array to the current position */
				updateInArray(pacman, layout, function (el) {
					return el.state.type !== 'C';
				});


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
			const pacman = state.map.getPacman();


			ghosts.forEach(ghost => {
				if (!ghost.state.frozen) {

					if (ghost.reachDestination()) {
						if (pacman.state.power) {
							ghost.state.scared = true;
						} else {
							ghost.state.scared = false;
						}

						/** update ghost's position and index in the main game collection(map array) */
						updateInArray(ghost, layout, function (el) {
							return el.state.color !== ghost.state.color;
						});


						/** Get all viable next paths for the ghost */
						let possiblePaths = getPossiblePaths(ghost, map, directions);




						/** Override normal behaviour when a ghost is in the ghost house */
						if (ghost.state.inGhostHouse && possiblePaths.some(path => path.tile.static.type === '-')) {
							const gatePath = possiblePaths.find(path => path.tile.static.type === '-');

							ghost.state.destination = gatePath.tile;
							ghost.state.direction = gatePath.direction;
							ghost.changeDirection();

							// prevent the ghost from entering the gate, when outside of it
							ghost.state.inGhostHouse = false;

							// prevent normal behaviour from happening
							return;
						}


						// prevent ghosts from passing through the gate
						possiblePaths = possiblePaths.filter(path => path.tile.static.type !== '-');







						/** If there is only one possible way ahead continue on the current path(a ghost cannot turn in the opposite direction) */
						if (possiblePaths.length === 1) {
							ghost.state.destination = possiblePaths[0].tile;
							ghost.state.direction = possiblePaths[0].direction;
							ghost.changeDirection();
						}

						/** If the ghost is in an intersection, it follows the next tile that is the closest to it's target(direct distance, not after tiles*/
						if (possiblePaths.length > 1) {
							let shortestDistance;
							let nextPath;

							possiblePaths.forEach(path => {
								// if the target is not pacman, calculate distance to the static position of the target
								ghost.state.target.state = ghost.state.target.state || ghost.state.target.static;

								const distanceToTarget = distance(ghost.state.target.state, path.tile.static);

								shortestDistance = shortestDistance || distanceToTarget;
								nextPath = nextPath || path;

								if (distanceToTarget < shortestDistance) {
									shortestDistance = distanceToTarget;
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
				}
			});

		},

		/** Check collision between pacman and every food, powerup or ghost element in the game
		 * pacman hits a food tile -> the food tile type becomes empty space 
		 * pacman hits a powerup -> the powerup tile type becomes empty space
		 * pacman hits a ghost: 
		 * 	If pacman had an active powerup ongoing, the ghost is respawned in the ghost house
		 * 	Else:
		 * 		if pacman has lives left the current game is reset with the food eaten remaining so
		 * 		else the game ends and the player is given the possibility of starting a new one  
		 */
		checkImpact() {
			const pacman = state.map.getPacman();
			const layout = state.map.getMap();
			const ghosts = state.map.getGhosts();

			// the background canvas(has food, powerups and walls drawn on it) should be redrawn if any food or powerup is eaten by pacman
			let redrawStatic = false;

			// run collision detection between pacman and every food, powerup and ghost element in the game
			layout.forEach(tile => {

				// if pacman hits a ghost restart the current round(pacman has lives left), end game(no lives left) or respawn the ghost
				if (tile.dinamic.length) {
					// test if the any of the dinamic elements from this tile hit pacman
					tile.dinamic.forEach(elem => {
						if (elem.state.type === 'M' && collide(pacman.state, elem.state)) {
							
							// active powerup ongoing -> respawn the ghost. pacman is unharmed
							if (pacman.state.power) {
								// erase the animated element
								layout[elem.state.index].dinamic = layout[elem.state.index].dinamic.filter(elem => elem.state.type !== 'M');

								// initialize another instance of the animated element in it's original position
								state.map.initAnimatedElement(elem.state.initIndex, 'M', elem.state.color);
							} else {
								state.lives -= 1;

								// pacman is out of lives left
								if (!state.lives) {
									// RESTART GAME COMPLETELY - PACMAN IS OUT OF LIVES
								} else {
									// erase the animated element
									layout[pacman.state.index].dinamic = layout[pacman.state.index].dinamic.filter(elem => elem.state.type !== 'C');

									// initialize another instance of the animated element in it's original position
									state.map.initAnimatedElement(pacman.state.initIndex, 'C');

									cancelAnimationFrame(state.loopId);
								}

							}
						}
					});
				}

				// increase score as pacman eats food tiles. Release ghost once pacman eats a part of the total food 
				if (tile.static.type === '*' && collide(pacman.state, tile.static)) {
					tile.static.type = ' ';
					redrawStatic = true;

					// update the score and the tiles eaten so far (note: the score)
					state.score += 1;

					releaseGhosts(state.score, state.map.state.foodTilesNumber, ghosts);
				}

				// If pacman hits a powerup, ghosts become scared for 3 seconds
				if (tile.static.type === '@' && collide(pacman.state, tile.static)) {
					tile.static.type = ' ';
					redrawStatic = true;

					pacman.state.power = true;
					setTimeout(() => {
						pacman.state.power = false;
					}, 3000);

				}

			});

			return redrawStatic;

		},

		draw(canvas1, canvas2) {
			if (!canvas2) {
				clear(foregroundCanvas);
			} else {
				clear(foregroundCanvas,	backgroundCanvas);
				state.map.drawStatic();
			}
			state.map.drawDinamic();
		},

		// GAME LOOP

		setLoopId(id) {
			state.loopId = id;
		},
		isPaused() {
			return !state.loopId;
		},
		play(loop) {
			state.loopId = requestAnimationFrame(loop);
		},
		pause() {
			cancelAnimationFrame(state.loopId);
			state.loopId = null;
		}
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