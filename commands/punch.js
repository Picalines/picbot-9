const { FunCommand } = require("./fun");

module.exports = new FunCommand({
    name: 'punch',

    description: 'Ты ударяешь другого участника сервера!',
    group: 'Фан',

    requireTarget: 'always',

    cases: {
        withTarget: {
            message: '$executor ударил $target',
            images: [
                'https://media0.giphy.com/media/l1J3G5lf06vi58EIE/giphy.gif',
                'https://media0.giphy.com/media/l0IyouZhJkG0MG9Us/giphy.gif',
                'https://media1.tenor.com/images/5560767dc6b5d40a795a295ed4116698/tenor.gif?itemid=10363305',
                'https://media1.tenor.com/images/c724e1c1ddef332e3c95165c09e5b7e2/tenor.gif?itemid=16184358',
                'https://media1.tenor.com/images/3c95ca85f89068660becde7a31f0f04d/tenor.gif?itemid=4973550',
            ],
        },
        selfTarget: {
            message: '$executor ударил сам себя. Помогите ему, кто-нибудь!',
        },
        targetIsBot: {
            message: 'А меня-то за что?..',
        },
    }
});
