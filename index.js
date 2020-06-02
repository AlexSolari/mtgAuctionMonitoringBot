
const stateManager = require("./services/stateManagmentService");
const bot = require('./services/botHelper');
const web = require('./services/webHelper');

stateManager.load();
const timeoutId = setInterval(() => {
    if (bot.ready){
        bot.start(stateManager);
        web.start(stateManager, bot);

        clearInterval(timeoutId);
    }
}, 100);
