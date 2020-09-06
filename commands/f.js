const { FunCommand } = require('./fun');

module.exports = new FunCommand({
    name: 'f',

    description: 'FFF',
    group: 'Фан',

    requireTarget: 'never',

    cases: {
        noTarget: {
            message: '$executor отдаёт честь...',
            images: [
                "https://media.giphy.com/media/npUpB306c3EStRK6qP/giphy.gif",
                "https://media.giphy.com/media/Gyb7Mrx7jlGF2/giphy.gif",
                "https://media.giphy.com/media/6tZsIBl8VMieveHImW/giphy.gif",
                "https://media.giphy.com/media/3o6gb6qrSpLhI0rGko/giphy.gif",
                [
                    'FFFFFFFFFFFFF',
                    'FFFFFFFFFFFFF',
                    'FFFF',
                    'FFFF',
                    'FFFFFFFFF',
                    'FFFFFFFFF',
                    'FFFF',
                    'FFFF',
                    'FFFF',
                ],
            ],
        },
    },
});
