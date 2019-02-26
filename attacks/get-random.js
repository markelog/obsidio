/**
 * Get random number in the range
 * @param {number} max
 * @param {number} min
 */
module.exports = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
