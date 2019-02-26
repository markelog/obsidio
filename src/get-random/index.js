/**
 * Get random number in the range
 * @param {number} max
 * @param {number} min
 */
module.exports = (max, min) => {
  const inclusiveMax = max - 1;
  const inclusiveMin = min + 1;

  return Math.floor(Math.random() * (inclusiveMax - inclusiveMin + 1)) + inclusiveMin;
};
