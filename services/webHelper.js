const express = require('express')
const port = 3000
const path = require('path');

class WebHelper {
    constructor(port) {
        this.port = port;
        this.app = express();
    }

    configStatic() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname + '/web/index.html'));
        });
        this.app.get('/renderService.js', (req, res) => {
            res.sendFile(path.join(__dirname + '/web/js/renderService.js'));
        });
        this.app.get('/script.js', (req, res) => {
            res.sendFile(path.join(__dirname + '/web/js/script.js'));
        });
    }

    configEndpoints(stateManager, botHelper) {
        this.app.get('/image', (req, res) => {
            let fileId = req.query.id;

            botHelper.bot.getFile(fileId)
                .then(f => {
                    res.send({ url: f.fileLink });
                })
                .catch(x => {
                    res.send({ url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png" });
                });
        });

        this.app.get('/bet', (req, res) => {
            const lotId = req.query.id;

            res.send({
                value: stateManager.state.bets[lotId] || "Нет ставки"
            });
        });

        this.app.get('/data', (req, res) => {
            const dateNow = Date.now();
            const pattern = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;

            const mapped = stateManager.state.lots
                .filter(lot => lot != null)
                .filter(lot => {
                    const dt = new Date(lot.dateEnd.replace(pattern, '$3-$2-$1'));
                    dt.setHours(23, 59, 59);

                    return dateNow <= dt;
                })
                .reduce((accumulator, current) =>
                    accumulator.some(lot => lot.id === current.id)
                        ? accumulator
                        : [...accumulator, current], []
                );

            res.send(mapped);
            stateManager.state.lots = mapped;
            stateManager.save();
        });
    }

    start(stateManager, botHelper) {
        this.configStatic();
        this.configEndpoints(stateManager, botHelper);

        this.app.listen(port, () => {
            console.log(`Started server.`);
        });
    }
}

module.exports = new WebHelper(port);