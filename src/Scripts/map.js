/**
 * Element: sizeX = window.width / map.width
 * 			sizeY = window.height / map.height
 * 			x = arrayIndex % map.width
 * 			y = Math.floor(arrayIndex / map.width)
 * 			draw (el) {
 * 				drawRect(x * sizeX, y * sizeY, sizeX, sizeY);
 * 			}
 *  
 * 
 * An array that holds and initializes every element in the game. It can draw either the walls, or all the other elements.
 * 
 * 
 *  
 */
import {round} from "./utility.js";
import Pacman from "./Pacman.js";

// initialize primitive map
const primitiveMap = [
	'#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#',
	'#','*','*','*','*','*','*','*','*','*','*','#','*','*','*','*','*','*','*','*','*','*','#',
	'#','@','#','#','#','*','#','#','#','#','*','#','*','#','#','#','#','*','#','#','#','@','#',
	'#','*','#','#','#','*','#','#','#','#','*','#','*','#','#','#','#','*','#','#','#','*','#',
	'#','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','#',
	'#','*','#','#','#','*','#','*','#','#','#','#','#','#','#','*','#','*','#','#','#','*','#',
	'#','*','*','*','*','*','#','*','#','#','#','#','#','#','#','*','#','*','*','*','*','*','#',
	'#','#','#','#','#','*','#','*','*','*','*','#','*','*','*','*','#','*','#','#','#','#','#',
	'#','#','#','#','#','*','#','#','#','#',' ','#',' ','#','#','#','#','*','#','#','#','#','#',
	'#','#','#','#','#','*','#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#','*','#','#','#','#','#',
	'#','#','#','#','#','*','#',' ','#','#','#',' ','#','#','#',' ','#','*','#','#','#','#','#',
	' ',' ',' ',' ',' ','*',' ',' ','#','M','M',' ','M','M','#',' ',' ','*',' ',' ',' ',' ',' ',
	'#','#','#','#','#','*','#',' ','#','#','#','#','#','#','#',' ','#','*','#','#','#','#','#',
	'#','#','#','#','#','*','#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#','*','#','#','#','#','#',
	'#','#','#','#','#','*','#',' ','#','#','#','#','#','#','#',' ','#','*','#','#','#','#','#',
	'#','#','#','#','#','*','#',' ','#','#','#','#','#','#','#',' ','#','*','#','#','#','#','#',
	'#','*','*','*','*','*','*','*','*','*','*',"#",'*','*','*','*','*','*','*','*','*','*',"#",
	'#','*','#','#','#','*','#','#','#','#','*',"#",'*','#','#','#','#','*','#','#','#','*',"#",
	'#','@','*','*','#','*','*','*','*','*','*',"C",'*','*','*','*','*','*','#','*','*','@',"#",
	'#','#','#','*','#','*','#','*','#','#','#','#','#','#','#','*','#','*','#','*','#','#','#',
	'#','*','*','*','*','*','#','*','*','*','*','#','*','*','*','*','#','*','*','*','*','*','#',
	'#','*','#','#','#','#','#','#','#','#','*','#','*','#','#','#','#','#','#','#','#','*','#',
	'#','*','#','#','#','#','#','#','#','#','*','#','*','#','#','#','#','#','#','#','#','*','#',
	'#','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','#',
	'#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'
];
primitiveMap.width = 23;
primitiveMap.height = 25;


const Map = (backgroundCanvas, foregroundCanvas) => {

	// the width/height of every element
	const elementWidth = round(backgroundCanvas.width / primitiveMap.width, 1);
	const elementHeight = round(backgroundCanvas.height / primitiveMap.height, 1);

	// transform every static element in an object with x,y and type properties (food and walls)
	// initializes every dinamic element in an instance of itself(Pacman, Ghost) 
	const map = primitiveMap.map( ( element, index ) => {

		//	get position
		const x = elementWidth / 2 + elementWidth * ( index % primitiveMap.width );
		const y = elementHeight / 2 + elementHeight * Math.floor( index / primitiveMap.width );
		
		if ( element === "C" ) { // Pacman
			return Pacman(foregroundCanvas, x, y);
		} else {
			return {
				x,
				y,
				type : element	
			};
		}
	});

	return Object.assign({}, {
		// helper
		get info () {
			return map;
		},

		// draw walls
		drawStatic () {
			map.forEach( currentItem => {
				if ( currentItem.type === "#" ) {
					backgroundCanvas.getContext("2d").fillStyle = "darkblue";

					// Add 1 to prevent straight lines appear at the edge of every element
					backgroundCanvas.getContext("2d").fillRect(	currentItem.x - elementWidth / 2,
																				currentItem.y - elementHeight / 2, 
																				elementWidth + 1, elementHeight + 1);
				}
			});
		},

		// draw food, ghosts and pacman
		drawDinamic () {
			map.forEach(currentItem => {
				if ( currentItem.type === "C" ) {
					currentItem.draw();
				}
			});
		}

	});
};


export default Map;



		// getPacman() {
		// 	return map.find(element => element.getType && element.getType () === "C");
		// },









// const Element = (x,y,type) => {
// 	return {
// 		x : x,
// 		y : y,
// 		type : type
// 	};
// };