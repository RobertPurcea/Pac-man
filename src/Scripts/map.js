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
import {round, indexToDoubleIndex} from "./utility.js";
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

	let pacmanIndex;

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
			pacmanIndex = index; 
			
			return Pacman(foregroundCanvas, x, y, index);
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
		getValue (index) {
			return map[index];
		},

		getPacman () {
			return map[pacmanIndex];
		},

		setValue (value, index) {
			map[index] = value;
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
		},

		// WATCH OUT FOR THE CASES WHERE THE ELEMENT IS AT THE MARGIN OF THE ARRAY AND THE RETURN VALUE WILL BE UNDEFINED
		// the element needs a direction and index properties
		// the map needs a width and height properties
		getNextTile (element) { 
			const index = element.index;
			const doubleIndex = indexToDoubleIndex(primitiveMap, index);

			if(doubleIndex[0] === 0 || doubleIndex[0] === 22 || doubleIndex[1] === 0 || doubleIndex[1] === 24) {
				alert("w");
			}

			switch (element.direction) {
				case "right":
					return map[index + 1];
				case "left":
					return map[index -  1];
				case "top":
					return map[index - primitiveMap.width];
				case "bottom":
					return map[index +  primitiveMap.width];
			}
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