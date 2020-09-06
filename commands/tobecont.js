const { FunCommand } = require('./fun');

module.exports = new FunCommand({
    name: 'tobecont',

    description: '*Продолжение следует*',
    group: 'Фан',

    requireTarget: 'never',

    cases: {
        noTarget: {
            message: '*Продолжение следует...*',
            images: [
                "https://steamuserimages-a.akamaihd.net/ugc/242458830522658785/AC845A7A289C48F9497620E45379001CC50CF398/"
            ],
        },
    },
});
