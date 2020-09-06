const { FunCommand } = require('./fun');

module.exports = new FunCommand({
    name: 'hug',

    description: 'Ты обнимаешь участника сервера :3',
    group: 'Фан',

    requireTarget: 'optional',

    cases: {
        withTarget: {
            message: '$executor обнимает $target',
            images: [
                "https://cdn.dribbble.com/users/90216/screenshots/1410933/3-drib-cindysuen-hugs.gif",
                "https://thumbs.gfycat.com/ExaltedHeftyLark-size_restricted.gif",
                "https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif",
                "https://media.giphy.com/media/42YlR8u9gV5Cw/giphy.gif",
                "https://media.giphy.com/media/JzsG0EmHY9eKc/giphy.gif",
                "https://media.giphy.com/media/KL7xA3fLx7bna/giphy.gif",
            ],
        },
        noTarget: {
            message: '$executor обнимает свою любимую пустоту...',
        },
        targetIsBot: {
            message: 'Спасибо <3',
            images: [
                "https://media.giphy.com/media/QMkPpxPDYY0fu/giphy.gif",
                "https://media.giphy.com/media/KL7xA3fLx7bna/giphy.gif",
            ],
        },
        selfTarget: {
            message: '$executor страдает от одиночества...',
        },
    },
});
