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
import {round, indexToDoubleIndex, doubleIndexToIndex} from "./utility.js";
import Pacman from "./Pacman.js";

let primitiveMap = [
	'#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#',
	'#',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',
	'#','@','#','#','#',' ','#','#','#','#',' ','#',' ','#','#','#','#',' ','#','#','#','@','#',
	'#',' ','#','#','#',' ','#','#','#','#',' ','#',' ','#','#','#','#',' ','#','#','#',' ','#',
	'#',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',
	'#',' ','#','#','#',' ','#',' ','#','#','#','#','#','#','#',' ','#',' ','#','#','#',' ','#',
	'#',' ',' ',' ',' ',' ','#',' ','#','#','#','#','#','#','#',' ','#',' ',' ',' ',' ',' ','#',
	'#','#','#','#','#',' ','#',' ',' ',' ',' ','#',' ',' ',' ',' ','#',' ','#','#','#','#','#',
	'#','#','#','#','#',' ','#','#','#','#',' ','#',' ','#','#','#','#',' ','#','#','#','#','#',
	'#','#','#','#','#',' ','#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',' ','#','#','#','#','#',
	'#','#','#','#','#',' ','#',' ','#','#','#',' ','#','#','#',' ','#',' ','#','#','#','#','#',
	' ',' ',' ',' ',' ',' ',' ',' ','#','M','M',' ','M','M','#',' ',' ',' ',' ',' ',' ',' ',' ',
	'#','#','#','#','#',' ','#',' ','#','#','#','#','#','#','#',' ','#',' ','#','#','#','#','#',
	'#','#','#','#','#',' ','#',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',' ','#','#','#','#','#',
	'#','#','#','#','#',' ','#',' ','#','#','#','#','#','#','#',' ','#',' ','#','#','#','#','#',
	'#','#','#','#','#',' ','#',' ','#','#','#','#','#','#','#',' ','#',' ','#','#','#','#','#',
	'#',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',"#",' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',"#",
	'#',' ','#','#','#',' ','#','#','#','#',' ',"#",' ','#','#','#','#',' ','#','#','#',' ',"#",
	'#','@',' ',' ','#',' ',' ',' ',' ',' ',' ',"C",' ','#',' ',' ',' ',' ','#',' ',' ','@',"#",
	'#','#','#',' ','#',' ','#',' ','#','#','#','#','#','#','#',' ','#',' ','#',' ','#','#','#',
	'#',' ',' ',' ',' ',' ','#',' ',' ',' ',' ','#',' ',' ',' ',' ','#',' ',' ',' ',' ',' ','#',
	'#',' ','#','#','#','#','#','#','#','#',' ','#',' ','#','#','#','#','#','#','#','#',' ','#',
	'#',' ','#','#','#','#','#','#','#','#',' ','#',' ','#','#','#','#','#','#','#','#',' ','#',
	'#',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','#',
	'#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'
];

// initialize primitive map
const normalMap = [
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
const width = 23;
const height = 25;


const Map = (backgroundCanvas, foregroundCanvas) => {

	let pacmanIndex;

	// the width/height of every element
	const elementWidth = backgroundCanvas.width / primitiveMap.width;
	const elementHeight = backgroundCanvas.height / primitiveMap.height;

	// transform every static element in an object with x,y and type properties (food and walls)
	// initializes every dinamic element in an instance of itself(Pacman, Ghost) 
	let map = primitiveMap.map( ( element, index ) => {

		//	get position
		const x = elementWidth / 2 + elementWidth * ( index % primitiveMap.width );
		const y = elementHeight / 2 + elementHeight * Math.floor( index / primitiveMap.width );
		
		if ( element === "C" ) { // Pacman
			pacmanIndex = index; 
			
			const maxPosX = backgroundCanvas.width;
			const maxPosY = backgroundCanvas.height;
			return Pacman(foregroundCanvas, x, y, index, maxPosX, maxPosY);
		} else {
			return {
				x,
				y,
				type : element,
				index 
			};
		}
	});

	return Object.assign({}, {

		getValue (index) {
			return map[index];
		},
		setValue (value, index) {
			map[index] = value;
		},
		get pacman () {
			return map[pacmanIndex];
		},







		swapIndexes (object1, object2) {
			let temp = object1.state.index;
			object1.state.index = object2.index;
			object2.index = temp;	
		},
		
		// swap two objects
		swap ( index1, index2 ) {
			let temp = map[index1];
			map[index1] = map[index2];
			map[index2] = temp;
		},

		// draw walls
		drawStatic () {
			map.forEach( currentItem => {
				if ( currentItem.type === "#") {
					backgroundCanvas.getContext("2d").strokeStyle = "darkblue";

					backgroundCanvas.getContext("2d").strokeRect( currentItem.x - elementWidth / 2,currentItem.y - elementHeight / 2, elementWidth, elementHeight);
				}
			});
		},

		// needs state access for type property
		drawDinamic () {
			map.forEach(currentItem => {
				if ( currentItem.state && currentItem.state.type === "C" ) {
					currentItem.draw();
				}
			});
		},

		/* get the next tile in located in the chosen direction(the default direction is pacman's validDirection property. If you specify user
		as option, the tile will be returned based on  pacman's userDirection property) */
		getNextTile (element, option) { 
			const index = element.state.index;

			element.oldX = element.state.x;
			element.oldY = element.state.y;
			
			let direction = option === "user" ? element.state.userDirection : element.state.validDirection;
						
						
			//	If the next tile is out of the map(pacman is on the margin of the map) return the tile located at the beginning of the opposite 
			//side of the map
			const doubleIndex = indexToDoubleIndex(primitiveMap, index);
			
			if ( doubleIndex[0] === 0 || doubleIndex[0] === ( width - 1 ) || doubleIndex[1] === 0 || doubleIndex[1] === ( height - 1 ) ) {
				
				let isGoingOut = false;
				
				if ( doubleIndex[0] === 0 && direction === "left" ) {
					doubleIndex[0] = width - 1;
					isGoingOut = true;
				} else if ( doubleIndex[0] === ( width - 1 ) && direction === "right" ) {
					doubleIndex[0] = 0;
					isGoingOut = true;
				}
				
				if ( doubleIndex[1] === 0 && direction === "up" ) {
					doubleIndex[1] = height - 1;
					isGoingOut = true;
				} else if ( doubleIndex[1] === ( height - 1 ) && direction === "down" ) {
					doubleIndex[1] = 0;
					isGoingOut = true;
				}
				
				if ( isGoingOut ) {
					return map[doubleIndexToIndex( primitiveMap, ...doubleIndex )];
				}
			}


			switch ( direction ) {
				case "right":
					return map[index + 1];
				case "left":
					return map[index - 1];
				case "up":
					return map[index - primitiveMap.width];
				case "down":
					return map[index + primitiveMap.width];
				default:
						alert(direction + "  getNextTile() !!!!!!!!!!!");
				
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