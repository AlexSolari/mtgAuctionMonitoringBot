
const stateManager = require("./services/stateManagmentService");
const bot = require('./services/botHelper');
const web = require('./services/webHelper');

stateManager.load();
let timeoutId = setTimeout(() => {
    if (bot.ready){
        bot.start(stateManager);
        web.start(stateManager, bot);
        
        clearTimeout(timeoutId);
    }
}, 100);
