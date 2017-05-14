import {
	round,
	almostIntersect,
} from './utility';


// shared functionality

const pacmanAndGhostCommon = state => ({
	/**
	 * Determines if the distance between the animated element and it's destination it less than it's speed
	 * 
	 * If the distance between the animated element and it's destination
	 * is less than or equal to it's speed, following the usual moving pattern, 
	 * the next position that the element is going to have is after his destination
	 * For this reason, when an distance between an element and his destination is less than 
	 * his speed, he is forced to move on top of his destination as his next move
	 *
	 * This prevents the animated element from stopping after the destination instead of exactly on it
	 */
	isNearDestination() {
		if (almostIntersect(
				state.x,
				state.y,
				state.destination.static.x,
				state.destination.static.y,
				state.speed,
			)) {
			return true;
		}
	},
	/**
	 * 'Teleports' the animated element on the exact location where his destination is 
	 */
	reachDestination() {
		state.x = state.destination.static.x;
		state.y = state.destination.static.y;
	},

	/** change the velocity of the element to follow the current direction */
	changeDirection() {
		const direction = state.currentDirection || state.direction;

		switch (direction) {
			case 'right':
				state.velX = state.speed;
				state.velY = 0;
				break;
			case 'left':
				state.velX = -state.speed;
				state.velY = 0;
				break;
			case 'up':
				state.velX = 0;
				state.velY = -state.speed;
				break;
			case 'down':
				state.velX = 0;
				state.velY = state.speed;
				break;
			default:
				console.log(`In pacman change direction function. Current direction: ${direction}`);
		}
	},

	/**
	 * Update the position of the animated element.
	 * Normally, the position is updated with the value of the current velocity.
	 * There is an exception, though: 
	 * 	When a ghost is located near the shortcut paths or she is scared,
	 * 	her location will only be updated with half the normal velocity
	 */
	updatePosition() {
		const canvas = state.canvas;

		//	if the element gets out of the map, he is relocated in the opposite side of the map
		(function relocate() {
			if (state.x > canvas.width) {
				state.x = 0;
			}
			if (state.y > canvas.height) {
				state.y = 0;
			}
			if (state.x < 0) {
				state.x = canvas.width;
			}
			if (state.y < 0) {
				state.y = canvas.height;
			}
		}());

		// If the ghosts are near the shortcut paths or they are scared update their position with half the speed
		if (state.type === 'M' && (
				state.x > state.canvas.width - state.tileWidth ||
				state.x < state.tileWidth ||
				state.y > state.canvas.height - state.tileHeight ||
				state.y < state.tileHeight ||
				state.scared
			)) {
			state.x += state.velX / 2;
			state.y += state.velY / 2;
		} else {
			state.x += state.velX;
			state.y += state.velY;
		}
	},
});



// own functionality

/** Calculate the angles necessary for pacman's mouth */
function getDrawingAngles(state) {
	/**
	 * I do not set to 0 and 2 to prevent pacman stopping the animation in full circle shape
	 * (let one small space to act as a completely closed mouth)
	 */
	let startAngle = 0.02;
	let endAngle = 1.98;

	switch (state.currentDirection) {
		case 'right':
			startAngle = 0.02;
			endAngle = 1.98;
			break;

		case 'left':
			startAngle += 1;
			endAngle += 1;
			break;

		case 'down':
			startAngle += 0.5;
			endAngle += 0.5;
			break;

		case 'up':
			startAngle += 1.5;
			endAngle += 1.5;
			break;

		default:
			console.log(`In getDrawingAngles: ${state.currentDirection}`);
	}

	// The maximum value allowed to modify the start/end angle (how wide the pacman's mouth will open)
	const maxAngleModification = 0.30;

	// calculate the current angle modification
	const anglePerStage = round(
		maxAngleModification / state.maxAnimationStage * state.animationStage,
		2,
	);

	// return the modified start and end angles
	return [(startAngle + anglePerStage) * Math.PI, (endAngle - anglePerStage) * Math.PI];
}

// calculate pacman's eye position
function getEyePosition(state) {
	return state.velY ? [state.x - (state.radius / 2), state.y] : [state.x, state.y - state.radius / 2];
}


const Pacman = (canvas, x, y, index, tileWidth, tileHeight) => {
	const state = {
		x,
		y,
		index,
		initIndex: index,

		canvas,
		radius: tileWidth * 0.4,
		tileWidth,
		tileHeight,

		type: 'C',

		velX: 3,
		velY: 0,
		speed: 3,

		animationStage: 0,
		maxAnimationStage: 8,
		isOpening: true,

		wantedUserDirection: 'right',
		currentDirection: 'right',
		destination: null,
		freeze: false,

		powerAlmostGone: false,
		controlsHandler: null
	};

	return Object.assign({}, pacmanAndGhostCommon(state), {
		draw(color) {
			const ctx = canvas.getContext('2d');

			ctx.beginPath();
			ctx.arc(state.x, state.y, state.radius, ...(getDrawingAngles(state)));
			ctx.lineTo(state.x, state.y);
			ctx.fillStyle = color || 'yellow';
			ctx.fill();

			ctx.beginPath();
			ctx.arc(...getEyePosition(state), state.radius / 10, 0 * Math.PI, 2 * Math.PI);
			ctx.fillStyle = 'black';
			ctx.fill();
		},

		/**
		 * Add a function to state.controlsHandler
		 * This functions acts as the callback to the keydown event listener added here 
		 * It changes wantedUserDirection to the current direction pointed by the key event handler
		 * It sets freeze to false to allow checking once more if this direction
		 * is now valid(can be copied as a current direction)
		 */
		setControls(up, right, down, left) {
			function handle(e) {
				if ([up, right, left, down].indexOf(e.key) !== -1) {
					state.freeze = false;
				}

				// set velocity based on what key the user pressed
				switch (e.key) {
					case up:
						state.wantedUserDirection = 'up';
						break;
					case down:
						state.wantedUserDirection = 'down';
						break;
					case right:
						state.wantedUserDirection = 'right';
						break;
					case left:
						state.wantedUserDirection = 'left';
						break;
					default:
						console.log(`Wrong key. Use up: ${up}, right: ${right}, down: ${down}, left: ${left}`);
				}
			}

			state.controlsHandler = handle;

			document.addEventListener('keydown', state.controlsHandler);
		},

		/**
		 * remove key handler with the function present in state.controlsHandler
		 */
		removeControls() {
			document.removeEventListener('keydown', state.controlsHandler);
		},

		/**
		 * Update pacman's animation.
		 * The animation progresses until pacman's mouth is opened at it's maximum then is reverses
		 */
		updateAnimation() {
			// if pacman is opening his mouth, increment animationStage, else decrement
			state.animationStage = state.isOpening ?
				state.animationStage += 1 :
				state.animationStage -= 1;

			// if the animation ended, set isOpening = !isOpening to reverse it
			if (state.animationStage === state.maxAnimationStage + 1) {
				state.isOpening = false;
			}
			if (state.animationStage === 0) {
				state.isOpening = true;
			}
		},


		// Utility
		get state() {
			return state;
		},

		isStuck() {
			return state.freeze === true;
		},
	});
};

export {
	Pacman,
	pacmanAndGhostCommon
};