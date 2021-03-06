/**
 * @template T
 * @param {readonly T[]} array 
 * @returns T | undefined
 */
export function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
