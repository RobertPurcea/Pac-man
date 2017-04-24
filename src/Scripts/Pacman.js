/**
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


import {round, random, almostIntersect, intersect} from "./utility.js";

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
const Pacman = (canvas, x, y, index) => {

	const state = {
		x : x,
		y : y,
		index : index,

		velX : 3,
		velY : 0,
		speed : 3,

		size : 10,
		animationStage : 0,
		maxAnimationStage : 8,
		isOpening : true, 

		userDirection : "right",
		validDirection : "right",
		destination : null,

		type : "C",
		stuck : false,
		needsSwap : true,
		isStuckAndSwapped : false
	};

	return {

		set destination (value) {
			state.destination = value;
		},
		set index (value) {
			state.index = value;
		},
		get state () {
			return state;
		},
		info () {
			console.log(state, state.destination);
		},
		


		// pacman almost reached the destination -->> change coordinates of pacman to match the coordinates of the destination, return true
		// pacman is at the destination -->> return true
		// without this, pacman will have cases when it crosses over the destination point without actually touching it (because the speed is higher than 1)
		reachDestination () {
			const coordinates = [state.x, state.y, state.destination.x, state.destination.y];

			if ( state.isStuckAndSwapped ) {return true;}
						
			if ( almostIntersect ( ...coordinates, state.speed ) ) {
				state.x = state.destination.x;
				state.y = state.destination.y;
				return true;
			}
		},

		// change pacman userDirection property on keypress and set state.stuck property to false
		setControls (up, right, down, left) {
			let lastEvent;

			document.addEventListener("keydown", e => {

				// ignore multiple consecutive keypresses of the same key
				if (lastEvent && lastEvent.key === e.key) {
					return;
				}

				lastEvent = e;

				state.stuck = false;
				
				// set velocity based on what key the user pressed 
				switch (e.key) {
					case up:
						state.userDirection = "up";
						break;
					case down:
						state.userDirection = "down";
						break;
					case right: 
						state.userDirection = "right";
						break;
					case left:
						state.userDirection = "left";
						break;
					default:
						console.log( "In pacman switch key handler" + e.key );
				}
			});
		},

		changeDirection () {
			switch ( state.validDirection ) {
				case "right":
					state.velX = state.speed;
					state.velY = 0;
					break;
				case "left":
					state.velX = -state.speed;
					state.velY = 0;
					break;
				case "up":
					state.velX = 0;
					state.velY = -state.speed;
					break;
				case "down":
					state.velX = 0;
					state.velY = state.speed;
					break;
				default:
						alert( "In change direction : " + state.validDirection );
			}
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
	};
};

export default Pacman;
