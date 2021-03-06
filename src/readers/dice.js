import { parsedRegexReader } from 'picbot-engine';
import { randomRangeInt } from '../utils/index.js';

/**
 * @param {string} userInput
 */
export const diceReader = parsedRegexReader(/\d+d\d+([+-]\d+)?/, dice => {
    const [n, N] = dice.match(/\d+d\d+/)?.[0].split('d').map(Number) ?? [-1, -1];

    if (n <= 0 || N <= 0) {
        return {
            isError: true,
            error: 'invalid dice',
        };
    }

    let random = randomRangeInt(n, n * N);
    const lastNum = Number(dice.match(/\d+$/)?.[0]);

    if (dice.includes('+')) random += lastNum;
    if (dice.includes('-')) random -= lastNum;

    if (random < 0) random = 0;

    return {
        isError: false,
        value: random,
    };
});
