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

// const Element = (x,y,type) => {
// 	return {
// 		x : x,
// 		y : y,
// 		type : type
// 	};
// };

// primitiveMap needs to have width and height properties 
// window must have width and height properties
const Map = (backgroundCanvas, foregroundCanvas) => {
	const backgroundCtx = backgroundCanvas.getContext("2d");
	const foregroundCtx = foregroundCanvas.getContext("2d");

	// size of the elements
	const elementWidth = round(backgroundCanvas.width / primitiveMap.width, 1);
	const elementHeight = round(backgroundCanvas.height / primitiveMap.height, 1);

	const map = primitiveMap.map( ( element, index ) => {
		const basicElement = {
				x : elementWidth / 2 + elementWidth * (index % primitiveMap.width),
				y : elementHeight / 2 + elementHeight * Math.floor( index / primitiveMap.width ),
				type : element, 
		};

		if ( element === "C" ) {
			return Object.assign(Pacman(foregroundCanvas, basicElement.x, basicElement.y), basicElement);
		} else {
			return basicElement;
		}
	});

	return Object.assign({}, {
		getMap() {
			console.log(map);
		},
		drawStatic () {
			map.forEach( currentItem => {
				if ( currentItem.type === "#" ) {
					backgroundCtx.fillStyle = "darkblue";
					backgroundCtx.fillRect(currentItem.x - elementWidth / 2, currentItem.y - elementHeight / 2, elementWidth, 			elementHeight);
				}
			});
		},
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