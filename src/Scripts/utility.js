// returns the number rounded to x decimals
const round = (number, decimals) => Math.round(number * 10 ** decimals) / 10 ** decimals;

// returns a random value between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export {round, random} ;