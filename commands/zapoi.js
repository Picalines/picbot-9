const { FunCommand } = require('./fun');

const images = [
    "https://media.giphy.com/media/E3L5goMMSoAAo/giphy.gif",
    "https://media.giphy.com/media/1BXa2alBjrCXC/giphy.gif",
    "https://media.giphy.com/media/xT1XGQHjEkRdsggVXi/giphy.gif",
    "https://media.giphy.com/media/TJckbZ9PTjkek/giphy.gif"
];

module.exports = new FunCommand({
    name: 'zapoi',

    description: 'Ты уходишь в *запой*...',
    group: 'Фан',

    requireTarget: 'optional',

    cases: {
        noTarget: {
            message: '$executor ушёл в запой...',
            images,
        },
        withTarget: {
            message: '$executor и $target ушли в запой...',
            images,
        },
    },
});
