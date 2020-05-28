const Lot = require("../entities/lot.js");

class MessageParsingService{
    constructor(){
        this.startPriceRegex = /(?<start>[Сс]тарт|[Нн]ач)[\D]*(?<price>\d+)/gmi;
        this.stepPriceRegex = /[\D]*(шаг|крок|ход|шах)[\D]*(?<price>\d+)/gmi;
        this.dateEndRegex = /(?<date>(?<dm>\d{1,2}\.\d{1,2})(?<year>\.\d{4})?)/gmi;
    }

    cleanUp(){
        this.startPriceRegex.lastIndex = 0;
        this.stepPriceRegex.lastIndex = 0;
        this.dateEndRegex.lastIndex = 0;
    }

    parse(msg){
        if (!msg)
            return null; 

        const startPriceMatch = this.startPriceRegex.exec(msg);
        const stepPriceMatch = this.stepPriceRegex.exec(msg);
        const dateEndMatch = this.dateEndRegex.exec(msg);
        
        this.cleanUp();

        if (startPriceMatch && stepPriceMatch && dateEndMatch){
            const start = startPriceMatch.groups["price"];
            const startMarker = startPriceMatch.groups["start"];
            const step = stepPriceMatch.groups["price"];
            const dayAndMonth = dateEndMatch.groups["dm"];
            const year = dateEndMatch.groups["year"] || ("."+new Date().getFullYear());
    
            const title = msg.split(startMarker)[0].replace("#аукцион", "").trim();

            const isAuction = !!(start && step && dayAndMonth) || msg.indexOf("#аукцион") != -1;

    
            return isAuction ? new Lot(
                start,
                step,
                (dayAndMonth + year),
                title.replace(/(https?:\/\/[^\s]+)/gi, '')
            ) : null;
        }

        return null;
    }
}

module.exports = new MessageParsingService();