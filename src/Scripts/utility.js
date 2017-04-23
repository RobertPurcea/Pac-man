// returns the number rounded to x decimals
const round = (number, decimals) => Math.round(number * 10 ** decimals) / 10 ** decimals;

// returns a random value between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// transforms a simple index to a x, y index
const indexToDoubleIndex = (array, index) => {
	return [index % array.width,  Math.floor( index / array.width )];
};

export {round, random, indexToDoubleIndex	};