// returns the number rounded to x decimals
const round = (number, decimals) => Math.round(number * 10 ** decimals) / 10 ** decimals;

// returns a random value between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;






// transforms a simple index into a x, y index
const indexToDoubleIndex = (array, index) => [index % array.numberOfHorizontalTiles, Math.floor(index / array.numberOfHorizontalTiles)];

// transforms a double index( x, y ) into a simple index
const doubleIndexToIndex = (array, index1, index2) => index1 + index2 * array.numberOfHorizontalTiles;






/** determine if the distance between two points is <= than the speed of the animated element
 * 
 * @param {*} x1
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} speed 
 */
const almostIntersect = (x1, y1, x2, y2, speed) => {
	const distance = Math.abs(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
	return distance <= speed;
};





/** Clear the provided canvases. If one of them is not provided it will simply be ignored */
function clear({ backgroundCanvas, foregroundCanvas }) {
	if (backgroundCanvas !== undefined) {
		backgroundCanvas.getContext('2d').clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
	}
	if (foregroundCanvas !== undefined) {
		foregroundCanvas.getContext('2d').clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
	}
}

/**
 * Determines if two elements collide.
 * Needs access to x,y and radius properties for each of the elements.
 * @param {*} element1 
 * @param {*} element2 
 */
function collide(element1, element2) {
	const distanceBetweenCenters = Math.abs(Math.sqrt((element2.x - element1.x) ** 2 + (element2.y - element1.y) ** 2));
	const distanceBetweenObjects = distanceBetweenCenters - element1.radius - element2.radius;
	return distanceBetweenObjects <= 2;
}

export { round, random, indexToDoubleIndex, almostIntersect, doubleIndexToIndex, clear, collide };








// const detectCollision = (element1, element2) => (
// 	Math.abs(Math.sqrt((element2.x - element1.x) ** 2 + (element2.y - element1.y) ** 2)) - element1
// );
// two points are in the same position  -->>  return true
// const intersect = (x1, y1, x2, y2) => {
	// return Math.abs(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)) === 0 ? true : false;
// };

// Array.prototype.swap = function (index1, index2) {
// 	const tmp = this[index1];
// 	this[index1] = this[index2];
// 	this[index2] = this[index1];
// };

// // 0 < distance <= speed  ==>>  return true
// const almostIntersect = (x1, y1, x2, y2, speed) => {
// 	const distance = Math.abs(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
// 	return (distance <= speed) && (distance > 0) ? true : false;
// };