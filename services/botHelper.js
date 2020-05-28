const TeleBot = require('telebot');
const fs = require('fs');
const parser = require("./messageParsingService");

class BotHelper {
    constructor() {
        this.stateManager = null;
        this.bot = null;
        this.ready = false;
        this.token = null;
    }

    start(stateManager) {
        this.stateManager = stateManager;
        this.bot = new TeleBot(this.token);

        this.bot.on('*', (msg) => {
            let img = null;
            let lot = parser.parse(msg.text || msg.caption);

            if (msg.photo && msg.photo.length != 0) {
                img = msg.photo.pop();
            }

            if (lot) {
                if (img)
                    lot.fileId = img.file_id;

                lot.id = msg.message_id;
                lot.link = `https://t.me/${msg.chat.username}/${msg.message_id}`;

                this.stateManager.state.lots.push(lot);
            }
            else if (msg.reply_to_message) {
                let replyId = msg.reply_to_message.message_id;
                let lotToFind = this.stateManager.state.lots.filter(x => x.id == replyId)[0];

                if (lotToFind) {
                    if (msg.text.indexOf("победител") != -1) {
                        this.stateManager.state.lots = this.stateManager.state.lots.filter(x => x.id != replyId);

                    } else if (/\d/.test(msg.text)) {
                        this.stateManager.state.bets[lotToFind.id] = msg.text;
                    }

                    this.stateManager.save();
                }
            }

        });

        this.bot.start(this.token);

        console.log("Started bot.")
    }
}

const helper = new BotHelper();
fs.readFile('token', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        helper.token = data;
        helper.ready = true;

        console.log("Prepeared bot.");
    }
});

module.exports = helper;