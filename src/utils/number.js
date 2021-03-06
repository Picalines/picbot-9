/**
 * @param {number} min
 * @param {number} max
 */
export function randomRangeInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * @param {number} number
 * @param {number} min
 * @param {number} max
 */
export function inRange(number, min, max) {
    return number >= min && number <= max;
}
