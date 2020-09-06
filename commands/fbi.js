const { FunCommand } = require('./fun');

module.exports = new FunCommand({
    name: 'fbi',

    description: 'Ты вызываешь FBI на участника сервера',
    group: 'Фан',

    requireTarget: 'always',

    cases: {
        withTarget: {
            message: '- Алло, ФБР? МЫ НАШЛИ $TARGET\n- ВЫЕЗЖАЕМ!',
            images: [
                "https://media1.tenor.com/images/93d11bc59526ce49f60766f0045d819b/tenor.gif?itemid=11500735",
                "https://thumbs.gfycat.com/DigitalCriminalHornedtoad-size_restricted.gif",
                "https://media.giphy.com/media/kxevHLcRrMbtC1SXa8/giphy.gif",
            ],
        },
        targetIsBot: {
            message: 'непон.',
        },
    },
});
