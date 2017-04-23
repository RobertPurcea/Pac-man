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
			
			return Pacman(foregroundCanvas, x, y, index);
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



		help () {
			map.forEach(el => {console.log(el.x);});
			console.log(elementWidth, elementHeight);
		},

		getValue (index) {
			return map[index];
		},
		setValue (value, index) {
			map[index] = value;
		},

		swap ( index1, index2 ) {
			let temp = map[index1];
			map[index1] = map[index2];
			map[index2] = temp;
		},

		swapIndexes (object1, object2) {
			let temp = object1.index;
			object1.index = object2.index;
			object2.index = temp;	
		},

		// needed for pacman modifications in index.js
		getPacman () {
			return map[pacmanIndex];
		},





		// draw walls
		drawStatic () {
			map.forEach( currentItem => {
				if ( currentItem.type === "#") {
					backgroundCanvas.getContext("2d").strokeStyle = "darkblue";

					backgroundCanvas.getContext("2d").strokeRect(	currentItem.x - elementWidth / 2,
																				currentItem.y - elementHeight / 2, 
																				elementWidth, elementHeight);
				}
			});
		},

		// draw food, ghosts and pacman
		// needs state access for type property
		drawDinamic () {
			map.forEach(currentItem => {
				if ( currentItem.state && currentItem.state.type === "C" ) {
					currentItem.draw();
				}
			});
		},

		// need access to state property(currently accessed with a getter)
		getNextTile (element) { 
			const index = element.state.index;
			const doubleIndex = indexToDoubleIndex(primitiveMap, index);
			

			// What happens when the next tile is out of the map(ex: map[-1])
			// if(doubleIndex[0] === 0 || doubleIndex[0] === 22 || doubleIndex[1] === 0 || doubleIndex[1] === 24) {
			// 	alert("w");
			// }


			switch (element.state.direction) {
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