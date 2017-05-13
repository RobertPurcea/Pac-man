import {
	reachDestination,
	directionControl,
	positionUpdate,
} from './Pacman';
import {
	random,
} from './utility';


const Ghost = (canvas, x, y, index, tileWidth, tileHeight, color) => {
	const state = {
		x,
		y,
		index,
		initIndex: index,

		tileHeight,
		tileWidth,
		canvas,

		speed: null,
		velX: 0,
		velY: 0,

		type: 'M',
		color,

		radius: tileWidth * 0.3,
		width: tileWidth * 0.8,
		height: tileWidth * 0.85,

		direction: 'left',
		drawingDirection: 'left',
		destination: null,
		target: null,

		frozen: false,

		idleEyeMovement: false,
		inGhostHouse: true,
		scared: false,
	};

	/** Initialize each ghost. Their speed and behaviour varies with it's color */

	if (color === 'skyblue' || color === 'red') {
		state.speed = color === "red" ? random(2.8, 3) : random(2.4, 2.6);
		state.direction = 'right';
		state.velX = state.speed;
	}

	if (color === 'pink' || color === 'orange') {
		state.speed = color === "pink" ? random(2, 2.2) : random(1.6, 1.8);
		state.direction = 'left';
		state.velX = -state.speed;

		state.frozen = true;
	}

	return Object.assign({}, reachDestination(state), directionControl(state), positionUpdate(state), {
		// draw after x, y, width, height
		draw() {
			const ctx = canvas.getContext('2d');

			const width = state.width;
			const height = state.height;
			const x = state.x;
			const y = state.y;

			/** If a ghost if frozen, it's direction is changed on a fixed interval to make it look alive
			 * (eye moving through the function randomEyeMovement)
			 */
			const direction = state.frozen ? state.drawingDirection : state.direction;

			// GHOST BODY

			ctx.beginPath();
			ctx.fillStyle = state.scared ? 'darkblue' : state.color;

			ctx.moveTo(x - width / 2, y + height / 2);
			ctx.lineTo(x - width / 2, y - height / 10);
			ctx.bezierCurveTo(x - width / 2, y - height / 2.8, x - width / 5, y - height / 2, x, y - height / 2);
			ctx.bezierCurveTo(x + width / 5, y - height / 2, x + width / 2, y - height / 2.8, x + width / 2, y - height / 10);
			ctx.lineTo(x + width / 2, y + height / 2);

			ctx.lineTo(x + width / 3.1, y + height / 2.6);
			ctx.lineTo(x + width / 6, y + height / 2);

			ctx.lineTo(x, y + height / 2.6);
			ctx.lineTo(x - width / 6, y + height / 2);

			ctx.lineTo(x - width / 3, y + height / 2.6);
			ctx.lineTo(x - width / 2, y + height / 2);
			ctx.fill();

			/** If the ghost is scared, it has a different styling  */
			if (state.scared) {
				// scared ghost eyes
				ctx.fillStyle = 'white';
				ctx.beginPath();

				ctx.arc(x - width / 4, y - height / 7, width / 13, 0, Math.PI * 2);
				ctx.arc(x + width / 4, y - height / 7, width / 13, 0, Math.PI * 2);
				ctx.fill();

				// scared ghost mouth
				ctx.beginPath();
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				ctx.moveTo(x + width / 3.5, y + height / 4);

				ctx.lineTo(x + width / 5, y + height / 5);
				ctx.lineTo(x + width / 9, y + height / 4);

				ctx.lineTo(x, y + height / 5);
				ctx.lineTo(x - width / 10, y + height / 4);

				ctx.lineTo(x - width / 5, y + height / 5);
				ctx.lineTo(x - width / 3.2, y + height / 4);

				ctx.stroke();
			} else {
				// Eye holes
				ctx.beginPath();
				ctx.fillStyle = 'white';

				ctx.moveTo(x - width / 2 + width / 3.5, y - height / 2 + height / 3.5);
				ctx.bezierCurveTo(x - width / 2 + width / 5.6, y - height / 2 + height / 3.5, x - width / 2 + width / 7, y - height / 2 + height / 2.54, x - width / 2 + width / 7, y - height / 2 + height / 2.15);
				ctx.bezierCurveTo(x - width / 2 + width / 7, y - height / 2 + height / 1.86, x - width / 2 + width / 5.6, y - height / 2 + height / 1.55, x - width / 2 + width / 3.5, y - height / 2 + height / 1.55);
				ctx.bezierCurveTo(x - width / 2 + width / 2.54, y - height / 2 + height / 1.55, x - width / 2 + width / 2.33, y - height / 2 + height / 1.86, x - width / 2 + width / 2.33, y - height / 2 + height / 2.15);
				ctx.bezierCurveTo(x - width / 2 + width / 2.33, y - height / 2 + height / 2.54, x - width / 2 + width / 2.54, y - height / 2 + height / 3.5, x - width / 2 + width / 3.5, y - height / 2 + height / 3.5);

				ctx.moveTo(x - width / 2 + width / 1.4, y - height / 2 + height / 3.5);
				ctx.bezierCurveTo(
					x - width / 2 + width / 1.64,
					y - height / 2 + height / 3.5,
					x - width / 2 + width / 1.75,
					y - height / 2 + height / 2.54,
					x - width / 2 + width / 1.75,
					y - height / 2 + height / 2.15
				);
				ctx.bezierCurveTo(x - width / 2 + width / 1.75, y - height / 2 + height / 1.86, x - width / 2 + width / 1.64, y - height / 2 + height / 1.55, x - width / 2 + width / 1.4, y - height / 2 + height / 1.55);
				ctx.bezierCurveTo(x - width / 2 + width / 1.21, y - height / 2 + height / 1.55, x - width / 2 + width / 1.16, y - height / 2 + height / 1.86, x - width / 2 + width / 1.16, y - height / 2 + height / 2.15);
				ctx.bezierCurveTo(x - width / 2 + width / 1.16, y - height / 2 + height / 2.54, x - width / 2 + width / 1.21, y - height / 2 + height / 3.5, x - width / 2 + width / 1.40, y - height / 2 + height / 3.5);
				ctx.fill();


				// Iris
				ctx.fillStyle = 'blue';

				switch (direction) {
					case 'left':
						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 1.55,
							y - height / 2 + height / 2,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();

						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 4.66,
							y - height / 2 + height / 2,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();
						break;

					case 'right':
						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 1.25,
							y - height / 2 + height / 2,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();

						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 2.8,
							y - height / 2 + height / 2,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();
						break;

					case 'up':
						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 1.4,
							y - height / 2 + height / 2.7,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();

						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 3.3,
							y - height / 2 + height / 2.7,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();
						break;

					case 'down':
						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 1.4,
							y - height / 2 + height / 1.8,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();

						ctx.beginPath();
						ctx.arc(
							x - width / 2 + width / 3.3,
							y - height / 2 + height / 1.8,
							width / 14,
							0, Math.PI * 2,
							true
						);
						ctx.fill();
						break;
					default:
						alert('In ghost direction switch statement');
				}
			}
		},

		// create or remove an interval that changes the drawingDirection from time to time, to create the impression of eye movement
		toggleRandomEyeMovement() {
			if (state.idleEyeMovement) {
				clearInterval(state.idleEyeMovement);
				state.idleEyeMovement = false;
			} else {
				const possibleDirections = ['up', 'down', 'left', 'right'];

				state.idleEyeMovement = setInterval(() => {
					state.drawingDirection = possibleDirections[random(0, 3)]; // !!! attention to default random function
				}, random(2000, 5000));
			}
		},

		get state() {
			return state;
		},
	});
};

export default Ghost;