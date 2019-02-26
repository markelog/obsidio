/**
 * Generate fake looking ip
 */
module.exports = () => {
  return [
    Math.floor(Math.random() * 255) + 1,
    Math.floor(Math.random() * 255) + 0,
    Math.floor(Math.random() * 255) + 0,
    Math.floor(Math.random() * 255) + 0
  ].join('.');
};
