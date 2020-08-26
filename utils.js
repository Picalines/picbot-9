/**
 * @param {number} xp
 */
module.exports.calculateLevel = (xp) => Math.floor(Math.sqrt(xp / 8));

/**
 * @param {number} min
 * @param {number} max
 */
module.exports.randomRangeInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
