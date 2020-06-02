const fs = require('fs');

class StateManager{
    constructor(){
        this.state = {
            bets: {},
            lots: [],
        };
    }

    save(callback){
        callback = callback || (() => {});
        fs.writeFile('save.json', JSON.stringify(this.state), 'utf8', callback);
    }

    load(){
        fs.readFile('save.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const loadedData = JSON.parse(data);
                this.state.bets = loadedData.bets || {};
                this.state.lots = loadedData.lots || [];
            }
        });
    }
}

module.exports = new StateManager();