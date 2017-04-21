import "babel-polyfill";
if (module.hot) module.hot.accept;
console.clear();

import {random, round} from "./Scripts/utility.js";

// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;



// return the angles of the pacman animation
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

// return the x,y coordinates for drawing pacman's eye
const getEyePosition = state => {
	if ( state.velY ) {
		return [state.x - state.size / 2, state.y];
	} else {
		return [state.x, state.y - state.size / 2];
	}
};


// OBJECT INTERFACE PACMAN
const PacMan = () => {
	const state = {
		x : random(0, width),
		y : random(0, height),
		velX : 0,
		velY : 0,
		speed : 3,
		size : 20,
		animationStage : 0,
		maxAnimationStage : 8,
		isOpening : true
	};

	return {
		// change the the direction of pacman on keypress
		setControls (up, right, down, left) {
			let lastEvent;

			document.addEventListener("keydown",e => {

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

		// update position and animationStage
		update () {
			state.animationStage = state.isOpening ? ++state.animationStage : --state.animationStage;

			if ( state.animationStage === state.maxAnimationStage + 1 ) {
				state.isOpening = false;
			}
			if ( state.animationStage === 0) {
				state.isOpening = true;
			}

			state.x += state.velX;
			state.y += state.velY;
		},

		draw () {
			ctx.clearRect(0,0,width,height);
			
			ctx.beginPath();
			ctx.arc(state.x, state.y, state.size, ...(getDrawingAngles(state))); 
			ctx.lineTo(state.x, state.y);
			ctx.fillStyle = "yellow";
			ctx.fill();

			ctx.beginPath();
			ctx.arc(...getEyePosition(state), state.size / 10, 0 * Math.PI, 2 * Math.PI); 
			ctx.fillStyle = "black";
			ctx.fill();
		}
	};
};


let pacman = PacMan();
pacman.setControls("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft");


// LOOP
const loop = () => {
	pacman.draw();
	pacman.update();
	
	id = requestAnimationFrame(loop);
};

let id = requestAnimationFrame(loop);

setTimeout(() => {
	cancelAnimationFrame(id);
}, 5000);



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