import Map from './Map';
import {
	clear,
	collide,
	oppositeDirection,
	distance,
	count,
	random
} from './utility';

/** Remove a dinamic element from it's current tile, and add it to it's destination's tile(modifying it's index too) */
function updateInGameArray(element, layout, condition) {
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
		directions: ['right', 'left', 'down', 'up'],

		gameLoopId: null,
		needsStaticRedraw: null,

		almostNotScaredInterval: null,
		pacmanInterval: null,
		intervalHelper: 0,

		frozen: null
	};

	function pause() {
		cancelAnimationFrame(state.gameLoopId);
		state.gameLoopId = null;

		document.querySelector("#cover").style.display = "block";
	}

	return Object.assign({}, {

		initialize() {
			state.map = Map(backgroundCanvas, foregroundCanvas, "darkblue");

			state.map.drawStatic();
			state.map.drawDinamic();

			document.querySelector("#cover p span").textContent = state.lives;

			// setup pacman
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
			if (!pacman.isStuck() && pacman.isNearDestination()) {

				pacman.reachDestination();

				/** Move pacman in the map array to the current position */
				updateInGameArray(pacman, layout, function (el) {
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

					if (ghost.isNearDestination()) {

						ghost.reachDestination();

						// SCARED MANAGEMENT
						if (pacman.state.power) {
							ghost.state.scared = true;
						} else {
							ghost.state.scared = false;
						}
						if (pacman.state.powerAlmostGone) {
							ghost.state.almostNotScared = true;
						} else {
							ghost.state.almostNotScared = false;
						}


						/** update ghost's position and index in the main game collection(map array) */
						updateInGameArray(ghost, layout, function (el) {
							return el.state.color !== ghost.state.color;
						});


						/** Get all viable next paths for the ghost */
						let possiblePaths = getPossiblePaths(ghost, map, state.directions);


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
							let nextPath;

							if (ghost.scared) {
								nextPath = possiblePaths[random(0, possiblePaths.length)];
							} else {
								let shortestDistance;

								possiblePaths.forEach(path => {
									const distanceToTarget = distance(ghost.state.target.state, path.tile.static);

									shortestDistance = shortestDistance || distanceToTarget;
									nextPath = nextPath || path;

									if (distanceToTarget < shortestDistance) {
										shortestDistance = distanceToTarget;
										nextPath = path;
									}
								});
							}

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
		actOnCollision() {
			const pacman = state.map.getPacman();
			const layout = state.map.getMap();
			const ghosts = state.map.getGhosts();

			// run collision detection between pacman and every food, powerup and ghost element in the game
			layout.forEach(tile => {

				/** Test if pacman hits a ghost
				 * if pacman hits a ghost: 
				 * 	restart the current round(pacman has lives left)
				 * 	end game(no lives left)
				 * 	respawn the ghost(pacman has power active)
				 */
				if (tile.dinamic.length) {
					let ghostsThatHitPacman = tile.dinamic.filter(animatedElement => (
						animatedElement.state.type === 'M' && collide(pacman.state, animatedElement.state)
					));

					ghostsThatHitPacman.forEach(ghost => {
						if (pacman.state.power) {
							layout[ghost.state.index].dinamic = layout[ghost.state.index].dinamic.filter(animatedElement => (
								ghost.state.color !== animatedElement.state.color
							));

							state.map.initAnimatedElement(ghost.state.initIndex, 'M', ghost.state.color);
						} else if (state.lives > 0) {
							state.lives -= 1;
							document.querySelector("#cover p span").textContent = state.lives;

							// Remove pacman
							layout[pacman.state.index].dinamic = layout[pacman.state.index].dinamic.filter(elem => (
								elem.state.type !== 'C'
							));
							pacman.removeControls();

							// Create a new pacman
							state.map.initAnimatedElement(pacman.state.initIndex, 'C');

							// Respawn ghosts 
							ghosts.forEach(ghost => {
								layout[ghost.state.index].dinamic = layout[ghost.state.index].dinamic.filter(elem => elem.state.type !== 'M');
								state.map.initAnimatedElement(ghost.state.initIndex, 'M', ghost.state.color);
							});

							pause();
							state.frozen = true;
							setTimeout(() => {
								state.frozen = false;
							}, 1000);
						}
					});
				}

				// increase score as pacman eats food tiles. Release ghost once pacman eats a part of the total food 
				if (tile.static.type === '*' && collide(pacman.state, tile.static)) {
					tile.static.type = ' ';
					state.needsStaticRedraw = true;

					// update the score and the tiles eaten so far (note: the score)
					state.score += 1;

					releaseGhosts(state.score, state.map.state.foodTilesNumber, ghosts);

				}

				// If pacman hits a powerup, ghosts become scared for 3 seconds
				if (tile.static.type === '@' && collide(pacman.state, tile.static)) {
					tile.static.type = ' ';
					state.needsStaticRedraw = true;

					pacman.state.power = true;

					// interval that enables the ghost animation when the scared state is about to wear out
					setTimeout(() => {
						state.almostNotScaredInterval = setInterval(() => {
							pacman.state.powerAlmostGone = !pacman.state.powerAlmostGone;
						}, 200);
					}, 2000);

					// remove the upper interval and set scared to false after 4 seconds 
					setTimeout(() => {
						clearInterval(state.almostNotScaredInterval);

						pacman.state.power = false;
						pacman.state.powerAlmostGone = false;
					}, 4000);

				}

			});

		},

		removeKeyHandler() {
			state.map.getPacman().removeControls();
		},

		draw(canvas1, canvas2) {
			if (!canvas2) {
				clear(foregroundCanvas);
			} else {
				clear(foregroundCanvas, backgroundCanvas);
				state.map.drawStatic();
			}
			state.map.drawDinamic();
		},






		// GAME LOOP

		setLoopId(id) {
			state.gameLoopId = id;
		},
		isPaused() {
			return !state.gameLoopId;
		},
		play(loop) {
			state.gameLoopId = requestAnimationFrame(loop);
			document.querySelector("#cover").style.display = "none";
		},
		pause,
		noLivesLeft() {
			return state.lives === 0;
		},
		isFrozen() {
			return state.frozen;
		},
		needsStaticRedraw() {
			return state.needsStaticRedraw;
		}
	});
};

export default Game;


// pause();


// // Reinitialize every animated element 
// setTimeout(() => {


// 	state.delay = false;

// }, 1000);

// state.pacmanInterval = setInterval(() => {
// 	//debugger;

// 	if (state.intervalHelper % 2 === 0) {
// 		pacman.draw();
// 	} else {
// 		pacman.draw('red')
// 	}

// 	state.intervalHelper += 1;

// 	if (state.intervalHelper === 4) {
// 		clearInterval(state.pacmanInterval);
// 		state.intervalHelper = 0;
// 		state.pacmanInterval = null;
// 	}
// }, 200);

// state.delay = true;






// // // pause game after pacman lost a life
// // pause();