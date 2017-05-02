/** TO-DO: Make the drawing function look nicer
 *
 *
 */
const Ghost = (canvas, x, y, index, tileWidth) => {
	const state = {
		x,
		y,
		index,
		direction: 'up',

		speed: 3,
		type: 'M',

		width: tileWidth * 0.8,
		height: tileWidth * 0.85,

		destination: null,
	};

	return Object.assign({}, {
		// draw after x, y, width, height
		draw() {
			const ctx = canvas.getContext('2d');

			const width = state.width;
			const height = state.height;
			const x = state.x;
			const y = state.y;

			// GHOST BODY
			ctx.beginPath();
			ctx.fillStyle = 'red';

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
				y - height / 2 + height / 2.15,
			);
			ctx.bezierCurveTo(x - width / 2 + width / 1.75, y - height / 2 + height / 1.86, x - width / 2 + width / 1.64, y - height / 2 + height / 1.55, x - width / 2 + width / 1.4, y - height / 2 + height / 1.55);
			ctx.bezierCurveTo(x - width / 2 + width / 1.21, y - height / 2 + height / 1.55, x - width / 2 + width / 1.16, y - height / 2 + height / 1.86, x - width / 2 + width / 1.16, y - height / 2 + height / 2.15);
			ctx.bezierCurveTo(x - width / 2 + width / 1.16, y - height / 2 + height / 2.54, x - width / 2 + width / 1.21, y - height / 2 + height / 3.5, x - width / 2 + width / 1.40, y - height / 2 + height / 3.5);
			ctx.fill();


			// Iris
			ctx.fillStyle = 'blue';

			switch (state.direction) {
				case 'left':
					ctx.beginPath();
					ctx.arc(
						x - width / 2 + width / 1.55,
						y - height / 2 + height / 2,
						width / 14,
						0, Math.PI * 2,
						true,
					);
					ctx.fill();

					ctx.beginPath();
					ctx.arc(
						x - width / 2 + width / 4.66,
						y - height / 2 + height / 2,
						width / 14,
						0, Math.PI * 2,
						true,
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
						true,
					);
					ctx.fill();

					ctx.beginPath();
					ctx.arc(
						x - width / 2 + width / 2.8,
						y - height / 2 + height / 2,
						width / 14,
						0, Math.PI * 2,
						true,
					);
					ctx.fill();
					break;

				case 'up':
					ctx.beginPath();
					ctx.arc(
						x - width / 2 + width / 1.4,
						y - height / 2 + height / 2.7,
						width / 14,
						0,	Math.PI * 2,
						true,
					);
					ctx.fill();

					ctx.beginPath();
					ctx.arc(
						x - width / 2 + width / 3.3,
						y - height / 2 + height / 2.7,
						width / 14,
						0, Math.PI * 2,
						true,
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
						true,
					);
					ctx.fill();

					ctx.beginPath();
					ctx.arc(
						x - width / 2 + width / 3.3,
						y - height / 2 + height / 1.8,
						width / 14,
						0, Math.PI * 2,
						true,
					);
					ctx.fill();
					break;
				default:
					alert('In ghost state.direction switch statement');
			}
		},

		get state() {
			return state;
		},
	});
};

export default Ghost;


// SCARED GHOST

// IRIS
// ctx.fillStyle = 'white';
// ctx.beginPath();

// ctx.arc(x - width / 4, y - height / 7, width / 13, 0, Math.PI * 2);
// ctx.arc(x + width / 4, y - height / 7, width / 13, 0, Math.PI * 2);
// ctx.fill();

// // MOUTH
// ctx.beginPath();
// ctx.strokeStyle = "white";
// ctx.lineWidth = 3;
// ctx.moveTo(x + width / 3.5, y + height / 4);

// ctx.lineTo(x + width / 5, y + height / 5);
// ctx.lineTo(x + width / 9, y + height / 4);

// ctx.lineTo(x , y + height / 5);
// ctx.lineTo(x - width / 10, y + height / 4);

// ctx.lineTo(x - width / 5, y + height / 5);
// ctx.lineTo(x - width / 3.2, y + height / 4);

// ctx.stroke();