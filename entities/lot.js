class Lot{
    constructor(start, step, dateEnd, title){
        this.start = start;
        this.step = step;
        this.dateEnd = dateEnd;
        this.title = title;
        this.fileId = null;
        this.id = null;
        this.link = null;
    }
}

module.exports = Lot;