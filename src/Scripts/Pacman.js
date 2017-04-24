/** How Pacman works
 * Pacman updates it's position 60 times per second, unless he either reached his destination object or he is stuck;
 
 * After pacman reaches the center of the destination, he is actually moved in the coresponding place in the map array;
 
 * The keyhandler changes the  boolean stuck to false in order to allow the loop of the game to check once more if the direction, now
	changed	by the user also by this keyhandler is a good one (no wall upfront). The keyhandler does not modify the validDirection directly,
	instead it modifies the userDirection property. If userDirection is a good direction(it is checked in the game.start() method), than the
	validDirection is assigned the value of userDirection.
	
 * The animation progress is directly affected by how much pacman moves. Thus, when pacman is stuck, the animation stops as well.
 
 * reachedDestination and stuck are needed to allow verifying if the pacman's direction is good after he has been stuck.
 
 * After pacman arrives to a new center of a tile(a new destination), he needs to update his position in the map array as well. The purpose of
	"needsSwap" is to tell whether pacman has already updated his position in the map. 
	
 * animationStage, maxAnimationStage and isOpening are needed for the animation of pacman (opening and closing mouth)
 
 * The changeDirection() function changes pacman's velocity based on the current valid direction
 * 
 */


import {round, random, almostIntersect} from "./utility.js";

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
const Pacman = (canvas, x, y, index, maxPosX, maxPosY) => {

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
		reachedDestination : false
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
		


		/* pacman almost reached the destination -->> change coordinates of pacman to match the coordinates of the destination, return true
		without this, pacman will have cases when it crosses over the destination point without actually touching it (because the speed is higher than 1) */
		reachDestination () {
			const coordinates = [state.x, state.y, state.destination.x, state.destination.y];

			if ( state.reachedDestination ) {return true;}
						
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

		// change the speed of pacman based on the current validDirection property
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
			//	if pacman gets out of the map, he is relocated in the opposite side of the map
			
			if ( state.x > maxPosX ) {
				state.x =  0;
			}
			if ( state.y > maxPosY ) {
				state.y = 0;
			}
			if ( state.x < 0 ) {
				state.x =  maxPosX;
			}
			if ( state.y < 0 ) {
				state.y = maxPosY;
			}
							
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






