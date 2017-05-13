import {
	indexToDoubleIndex,
	doubleIndexToIndex,
} from './utility';

import {
	Pacman
} from './Pacman';
import Ghost from './Ghost';
import layout from './levelEditor';

/** Calculate in what directions a wall can shrink */
function getDirectionsToEmptyTiles({
	map,
	index,
	width,
	wallShrink: size = 1
}) {
	let topleft = 0;
	let topright = 0;
	let bottomleft = 0;
	let bottomright = 0;
	let right = 0;
	let left = 0;
	let top = 0;
	let bottom = 0;


	right = (map[index + 1] !== undefined) && (map[index + 1].static.type !== '#') ? size : 0;
	left = (map[index - 1] !== undefined) && (map[index - 1].static.type !== '#') ? size : 0;
	top = (map[index - width] !== undefined) && (map[index - width].static.type !== '#') ? size : 0;
	bottom = (map[index + width] !== undefined) && (map[index + width].static.type !== '#') ? size : 0;


	if (map[index - width - 1]) {
		if ((map[index - width - 1].static.type !== '#') && (!top && !left)) {
			topleft = size;
		}
	}
	if (map[index - width + 1]) {
		if (map[index - width + 1].static.type !== '#' && (!top && !right)) {
			topright = size;
		}
	}
	if (map[index + width - 1]) {
		if (map[index + width - 1].static.type !== '#' && (!bottom && !left)) {
			bottomleft = size;
		}
	}
	if (map[index + width + 1]) {
		if (map[index + width + 1].static.type !== '#' && (!bottom && !right)) {
			bottomright = size;
		}
	}


	return {
		top,
		bottom,
		left,
		right,
		topleft,
		topright,
		bottomleft,
		bottomright,
	};
}

const Map = (backgroundCanvas, foregroundCanvas) => {
	const state = {
		numberOfHorizontalTiles: layout.numberOfHorizontalTiles,
		numberOfVerticalTiles: layout.numberOfVerticalTiles,

		tileWidth: backgroundCanvas.width / layout.numberOfHorizontalTiles,
		tileHeight: backgroundCanvas.height / layout.numberOfVerticalTiles,

		layout,
		foodTilesNumber: 0
	};

	// viable ghost colors. DON'T CHANGE
	const ghostColors = ['red', 'skyblue', 'pink', 'orange'];

	// initialize every element in the game in the map array
	const map = state.layout.map((element, index) => {
		// calculate center coordinates
		const x = state.tileWidth / 2 + state.tileWidth * (index % state.numberOfHorizontalTiles);
		const y = state.tileHeight / 2 + state.tileHeight * Math.floor(index / state.numberOfHorizontalTiles);

		// create initial map. Note: dinamic is an array
		const dinamic = [];
		if (element === 'C') {
			dinamic.push(Pacman(foregroundCanvas, x, y, index, state.tileWidth, state.tileHeight));
		} else if (element === 'M') {
			dinamic.push(Ghost(foregroundCanvas, x, y, index, state.tileWidth, state.tileHeight, ghostColors[0]));
			ghostColors.shift();
		}

		/**
		 * if the current element is an animated one, it will be present in the dinamic array
		 * the static element though, has to be of type space, at least at the beginning
		 */
		if (element === 'C' || element === 'M') {
			element = ' ';
		}

		// for food and powerpills, calculate and append their radius to static properties
		let radius;
		if (element === '*') {
			radius = Math.floor(state.tileWidth / 13);
			state.foodTilesNumber += 1;
		}
		if (element === '@') radius = Math.floor(state.tileWidth / 5);

		return {
			static: {
				x,
				y,
				type: element,
				index,
				radius,
			},
			dinamic,
		};
	});

	/** Get the next tile located on a chosen direction beginning from the current index */
	function getNextTile(index, direction) {
		const width = state.numberOfHorizontalTiles;
		const height = state.numberOfVerticalTiles;
		let nextTile;



		/**
		 * If the next tile is leading outside of the map array, RETURN it's position
		 * in the array on the beggining of it's opposite side.
		 *
		 * The function won't execute further if the conditions below are met!!
		 */
		const doubleIndex = indexToDoubleIndex(state.layout, index);

		if (
			doubleIndex[0] === 0 ||
			doubleIndex[0] === (width - 1) ||
			doubleIndex[1] === 0 ||
			doubleIndex[1] === (height - 1)
		) {
			let isGoingOut = false;

			// calculate the x index if the element leaves the maze horizontally
			if (doubleIndex[0] === 0 && direction === 'left') {
				doubleIndex[0] = width - 1;
				isGoingOut = true;
			} else if (doubleIndex[0] === (width - 1) && direction === 'right') {
				doubleIndex[0] = 0;
				isGoingOut = true;
			}

			// calculate the y index if the element leaves the maze vertically
			if (doubleIndex[1] === 0 && direction === 'up') {
				doubleIndex[1] = height - 1;
				isGoingOut = true;
			} else if (doubleIndex[1] === (height - 1) && direction === 'down') {
				doubleIndex[1] = 0;
				isGoingOut = true;
			}

			/**
			 * If the element is going to leave the maze, return the index calculated
			 * after the values of the horizontal and vertival index from above
			 */
			if (isGoingOut) {
				return map[doubleIndexToIndex(state.layout, ...doubleIndex)];
			}
		}


		/**
		 * Simply return the next tile, the animated element is facing.
		 * Note: If this is running, the next tile was not located outside of the map
		 */
		switch (direction) {
			case 'right':
				nextTile = map[index + 1];
				break;
			case 'left':
				nextTile = map[index - 1];
				break;
			case 'up':
				nextTile = map[index - state.numberOfHorizontalTiles];
				break;
			case 'down':
				nextTile = map[index + state.numberOfHorizontalTiles];
				break;
			default:
				alert(`${direction}  getNextTile() !!!!!!!!!!!`);
		}

		return nextTile;
	}

	function getPacman() {
		let pacman;

		map.some((element) => {
			pacman = element.dinamic.find(elem => elem.state && elem.state.type === 'C');
			return pacman;
		});

		return pacman;
	}

	return Object.assign({}, {
		getNextTile,

		/** Draw walls, food, powerpills and ghost gate. Also reduce the size of walls */
		drawStatic() {
			const ctx = backgroundCanvas.getContext('2d');
			const wallShrink = 4;

			map.forEach((el, index) => {
				/** Draw walls
				 * The actual size of a wall is exactly that of a tile. In order to make the walls appear
				 * smaller I had to reduce only the parts where a part of wall does not face another wall.
				 */
				if (el.static.type === '#') {
					ctx.fillStyle = 'darkblue';

					const {
						top,
						right,
						bottom,
						left,
						topleft,
						topright,
						bottomleft,
						bottomright,
					} = getDirectionsToEmptyTiles({
						map,
						index,
						width: state.numberOfHorizontalTiles,
						wallShrink,
					});

					ctx.fillRect(
						el.static.x - state.tileWidth / 2 + left,
						el.static.y - state.tileHeight / 2 + top,
						state.tileWidth - left - right,
						state.tileHeight - top - bottom,
					);

					if (topleft) {
						ctx.clearRect(
							el.static.x - state.tileWidth / 2,
							el.static.y - state.tileHeight / 2,
							wallShrink, wallShrink,
						);
					}
					if (bottomleft) {
						ctx.clearRect(
							el.static.x - state.tileWidth / 2,
							el.static.y + state.tileHeight / 2 - wallShrink,
							wallShrink, wallShrink,
						);
					}
					if (topright) {
						ctx.clearRect(
							el.static.x + state.tileWidth / 2 - wallShrink,
							el.static.y - state.tileHeight / 2,
							wallShrink, wallShrink,
						);
					}
					if (bottomright) {
						ctx.clearRect(
							el.static.x + state.tileWidth / 2 - wallShrink,
							el.static.y + state.tileHeight / 2 - wallShrink,
							wallShrink, wallShrink,
						);
					}
				}

				// Draw food
				if (el.static.type === '*') {
					ctx.fillStyle = 'yellow';
					ctx.beginPath();

					ctx.arc(
						el.static.x,
						el.static.y,
						state.tileWidth / 13,
						0,
						2 * Math.PI,
					);

					ctx.fill();
				}

				// Draw power pills
				if (el.static.type === '@') {
					ctx.fillStyle = 'orange';
					ctx.beginPath();

					ctx.arc(
						el.static.x,
						el.static.y,
						state.tileWidth / 5,
						0,
						2 * Math.PI,
					);

					ctx.fill();
				}

				// Draw ghost gate
				if (el.static.type === '-') {
					ctx.strokeStyle = 'red';
					ctx.lineWidth = 8;

					ctx.beginPath();

					ctx.moveTo(el.static.x - state.tileWidth / 2 - 3, el.static.y);
					ctx.lineTo(el.static.x + state.tileWidth / 2 + 3, el.static.y);

					ctx.stroke();
				}
			});
		},

		/** Draws every animated element in the game by using their own draw function */
		drawDinamic() {
			map.forEach((element) => {
				element.dinamic.forEach((elem) => {
					if (elem.state) {
						elem.draw();
					}
				});
			});
		},

		initAnimatedElement(index, type, color) {
			/** Calculate coordinates based on the index */
			const x = state.tileWidth / 2 + state.tileWidth * (index % state.numberOfHorizontalTiles);
			const y = state.tileHeight / 2 + state.tileHeight * Math.floor(index / state.numberOfHorizontalTiles);

			// initialize ghost or pacman and push them in the map array 
			if (type === 'C') {
				const pacman = Pacman(foregroundCanvas, x, y, index, state.tileWidth, state.tileHeight);

				map[index].dinamic.push(pacman);
				pacman.state.destination = getNextTile(pacman.state.index, pacman.state.currentDirection);

				pacman.setControls('w', 'd', 's', 'a');
			} else if (type === 'M') {
				const ghost = Ghost(foregroundCanvas, x, y, index, state.tileWidth, state.tileHeight, color);

				map[index].dinamic.push(ghost);
				ghost.state.destination = getNextTile(ghost.state.index, ghost.state.direction);

				ghost.state.target = getPacman();
			} else {
				throw new Error(`In initAnimatedElement: index -> ${index}, type -> ${type}`)
			}
		},


		// Helpers

		// Return pacman from the map array
		getPacman,

		// return all the ghosts in an array
		getGhosts() {
			let ghosts = [];
			let index = 0;

			map.forEach(elem => {
				if (elem.dinamic.length) {
					elem.dinamic.forEach(dinamicElem => {
						if (dinamicElem.state.type === 'M') {
							ghosts[index] = dinamicElem;
							index++;
						}
					});
				}
			});

			return ghosts;
		},

		getMap() {
			return map;
		},

		get state() {
			return state;
		}

	});
};


export default Map;













// get size() {
// 	return [state.numberOfHorizontalTiles, state.numberOfVerticalTiles];
// },
// get pacman() {
// 	return map[pacmanIndex];
// },
// get platform() {
// 	return map;
// },
// swapIndexes(object1, object2) {
// 	const temp = object1.state.index;
// 	object1.state.index = object2.index;
// 	object2.index = temp;
// },
// swap two objects
// swap(index1, index2) {
// 	const temp = map[index1];
// 	map[index1] = map[index2];
// 	map[index2] = temp;
// },

/*
		getNextTile(element, option) {
			const index = element.state.index;

			element.oldX = element.state.x;
			element.oldY = element.state.y;

			const direction = option === 'user' ? element.state.userDirection : element.state.validDirection;


			//	If the next tile is out of the map(pacman is on the margin of the map) return the tile located at the beginning of the opposite
			// side of the map
			const doubleIndex = indexToDoubleIndex(state.layout, index);

			if (doubleIndex[0] === 0 || doubleIndex[0] === (width - 1) || doubleIndex[1] === 0 || doubleIndex[1] === (height - 1)) {
				let isGoingOut = false;

				if (doubleIndex[0] === 0 && direction === 'left') {
					doubleIndex[0] = width - 1;
					isGoingOut = true;
				} else if (doubleIndex[0] === (width - 1) && direction === 'right') {
					doubleIndex[0] = 0;
					isGoingOut = true;
				}

				if (doubleIndex[1] === 0 && direction === 'up') {
					doubleIndex[1] = height - 1;
					isGoingOut = true;
				} else if (doubleIndex[1] === (height - 1) && direction === 'down') {
					doubleIndex[1] = 0;
					isGoingOut = true;
				}

				if (isGoingOut) {
					return map[doubleIndexToIndex(state.layout, ...doubleIndex)];
				}
			}


			switch (direction) {
				case 'right':
					return map[index + 1];
				case 'left':
					return map[index - 1];
				case 'up':
					return map[index - state.numberOfHorizontalTiles];
				case 'down':
					return map[index + state.numberOfHorizontalTiles];
				default:
					alert(`${direction}  getNextTile() !!!!!!!!!!!`);

			}
		},
*/