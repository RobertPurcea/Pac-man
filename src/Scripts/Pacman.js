/**
 * Every reqAnimationFrame, check if the position of the pacman(x,y) is equal to the position of it's destination
 * 	If NO, run pacman.update();
 * 	If YES,  set map[destinationIndex] = pacman;
 * 				set map[pacmanIndex] = empty space;
 * 				if the next tile is an empty space, set the destination equal to it ELSE set destination = null
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


import {round, random} from "./utility.js";

// return the angles neccesary for the pacman animation
const getDrawingAngles = state => {

	// I do not set to 0 and 2 to prevent pacman stopping the animation in full circle shape
	let startAngle = 0.02, endAngle = 1.98;

	// TRY TO MAKE A FUNCTION
	// right 
	if ( state.velX > 0 ) {
		startAngle = 0.02;
		endAngle = 1.98;
	}
	// down 
	if ( state.velY > 0 ) {
		startAngle += 0.5;
		endAngle += 0.5;
	}
	// left 
	if ( state.velX < 0 ) {
		startAngle += 1;
		endAngle += 1;
	}
	// up 
	if ( state.velY < 0 ) {
		startAngle += 1.5;
		endAngle += 1.5;
	}

	// The maximum value allowed to modify the start/end angle (this is how wide the pacman's mouth will open)
	const maxAngleModification = 0.30;

	// calculate the current angle modification
	const anglePerStage = round(maxAngleModification / state.maxAnimationStage * state.animationStage, 2);

	// return the modified start and end angles
	return [(startAngle + anglePerStage) * Math.PI, (endAngle - anglePerStage) * Math.PI];
};

// return the coordinates for pacman's eye
const getEyePosition = state => {
	if ( state.velY ) {
		return [state.x - state.size / 2, state.y];
	} else {
		return [state.x, state.y - state.size / 2];
	}
};


// OBJECT INTERFACE PACMAN
const Pacman = (canvas, x, y) => {
	
	const state = {
		x : x,
		y : y,
		velX : 4,
		velY : 0,
		speed : 4,
		size : 10,
		animationStage : 0,
		maxAnimationStage : 8,
		isOpening : true, 
		direction : "right",
		type : "C"
	};

	return {

		// change the the velocity of pacman on keypress, without executing all the function multiple times for the samekey pressed multiple consecutive times
		setControls (up, right, down, left) {
			let lastEvent;

			document.addEventListener("keydown", e => {

				// ignore multiple keypresses of the same key
				if (lastEvent && lastEvent.key === e.key) {
					return;
				}

				lastEvent = e;

				// set velocity based on what key the user pressed 
				switch (e.key) {
					case up:
						state.velY = -state.speed;
						state.velX = 0;
						break;
					case down:
						state.velY = state.speed;
						state.velX = 0;
						break;
					case right: 
						state.velY = 0;
						state.velX = state.speed;
						break;
					case left:
						state.velX = -state.speed;
						state.velY = 0;
						break;
				}
			});
		},

		// update position and animation progress
		update () {
			// if pacman is opening his mouth, increment animationStage, else decrement
			state.animationStage = state.isOpening ? ++state.animationStage : --state.animationStage;

			// if the animation ended, set isOpening = !isOpening to reverse it
			if ( state.animationStage === state.maxAnimationStage + 1 ) {
				state.isOpening = false;
			}
			if ( state.animationStage === 0) {
				state.isOpening = true;
			}
			
			// update position
			state.x += state.velX;
			state.y += state.velY;
		},

		// draw pacman on the received canvas 
		draw () {
			const ctx = canvas.getContext("2d");

			ctx.clearRect(0,0,canvas.width, canvas.height);
			
			ctx.beginPath();
			ctx.arc(state.x, state.y, state.size, ...(getDrawingAngles(state))); 
			ctx.lineTo(state.x, state.y);
			ctx.fillStyle = "yellow";
			ctx.fill();

			ctx.beginPath();
			ctx.arc(...getEyePosition(state), state.size / 10, 0 * Math.PI, 2 * Math.PI); 
			ctx.fillStyle = "black";
			ctx.fill();
		},

		get type () {
			return state.type;
		}

	};
};

export default Pacman;



// // based on the current direction and array positioning, return the next empty space that pacman is heading to
// // return null if the next tile is a wall
// nextEmptyTile () {
// 	let nextTile;

// 	switch ( state.direction ) {
// 		case "right":
// 			nextTile = ""
// 	}
// }





// // execute a function based on the direction of the pacman
// const forEveryDirection = (state, fnUp, fnRight, fnDown, fnLeft) => {
// 	// up
// 	if ( state.velY < 0 ) {
// 		fnUp();
// 	}
// 	// right
// 	if ( state.velX > 0 ) {
// 		fnRight();
// 	}
// 	// down
// 	if ( state.velY > 0 ) {
// 		fnDown();
// 	}
// 	// left 
// 	if ( state.velX < 0 ) {
// 		fnLeft();
// 	}
// };