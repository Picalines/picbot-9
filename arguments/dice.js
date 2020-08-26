const { ArgumentReaders: { ReadRegex } } = require('picbot-engine');
const { randomRangeInt } = require('../utils');

/**
 * @param {string} userInput
 */
const readDice = userInput => {
    const dice = ReadRegex('\\d+d\\d+([+-]\\d+)?', userInput);
    if (!dice) {
        return {
            isError: true,
            error: 'notFound',
        };
    }

    const [n, N] = dice.match(/\d+d\d+/)[0].split('d').map(Number);

    let random = randomRangeInt(n, n * N);
    let lastNum = Number(dice.match(/\d+$/)[0]);
    if (dice.includes('+')) random += lastNum;
    if (dice.includes('-')) random -= lastNum;

    if (random < 0) random = 0;

    return {
        isError: false,
        value: {
            length: dice.length,
            parsedValue: random,
        },
    };
};

module.exports = {
    name: 'dice',
    reader: readDice,
}
