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

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
module.exports.clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * @param {number} seconds
 */
module.exports.timestamp = (seconds) => {
    const dateObj = new Date(0);
    dateObj.setSeconds(seconds);
    const hours = dateObj.getUTCHours().toString();
    const minutes = dateObj.getUTCMinutes().toString();
    seconds = dateObj.getSeconds();

    return hours.padStart(2, '0') 
        + ':' + minutes.padStart(2, '0')
        + ':' + seconds.toString().padStart(2, '0');
}

/**
 * @param {number} number
 * @param {number} min
 * @param {number} max
 */
module.exports.inRange = (number, min, max) => number >= min && number <= max;

/**
 * @template T
 * @param {T[]} array
 * @returns {T} 
 */
module.exports.randomFrom = (array) => array[Math.floor(Math.random() * array.length)];
