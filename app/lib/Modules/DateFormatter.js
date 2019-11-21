class DateFormatter {

    constructor() {
    }

    date(date) 
    {
        let now = date().utcOffset("+07:00").format('YYYY/MM/DD HH:mm:ss');
        let setFormat = `${now}`;

        return setFormat;
    };

    format(moduleDate, date) 
    {
        let now = moduleDate(date, ["MM-DD-YYYY", "YYYY-MM-DD"]).format('YYYY-MM-DD');
        let setFormat = `${now}`;

        return setFormat;
    };

    transactionDate(date)
    {
        let now = date().utcOffset("+07:00").format('YYYYMMDD');
        let setFormat = `${now}`;

        return setFormat;
    }

    formatNoSlashDate(date)
    {
        let now = date().utcOffset("+07:00").format('YYYYMMDD');
        let setFormat = `${now}`;

        return setFormat;
    }

    formatNoSlashDateTime(date)
    {
        let now = date().utcOffset("+07:00").format('YYYYMMDDHHmmss');
        let setFormat = `${now}`;

        return setFormat;
    }

    formatyyyymmddhi(date)
    {
        let now = date().utcOffset("+07:00").format('YYYYMMDDHHmm');
        let setFormat = `${now}`;

        return setFormat;
    }

    formatyyyymmddh(date)
    {
        let now = date().utcOffset("+07:00").format('YYYYMMDDHH');
        let setFormat = `${now}`;

        return setFormat;
    }

    findDate(date)
    {
        let now = date().utcOffset("+07:00").format('YYYY/MM/DD');
        let setFormat = `${now}`;

        return setFormat;
    }

    expiredfourtySecond(date) 
    {
        var d1 = new Date (),
            d2 = new Date ( d1 );
        d2.setSeconds ( d1.getSeconds() + 40 );
        var expired = date(d2).utcOffset("+07:00").format('MM-DD-YYYY HH:mm:ss');
        
        return expired;
    };

    expiredForImageWeb(date) 
    {
        var d1 = new Date (),
            d2 = new Date ( d1 );
        d2.setSeconds ( d1.getSeconds() + (12*60*60) );
        var expired = date(d2).utcOffset("+07:00").format('MM-DD-YYYY HH:mm:ss');
        
        return expired;
    };

    expiredTwoMinute(date) 
    {
        var d1 = new Date (),
            d2 = new Date ( d1 );
        d2.setMinutes ( d1.getMinutes() + 2 );
        var expired = date(d2).utcOffset("+07:00").format('YYYY/MM/DD HH:mm:ss');
        
        return expired;
    };

    expiredAndroid(date) 
    {
        var d1 = new Date (),
            d2 = new Date ( d1 );
        d2.setMonth ( d1.getMonth() + 256 );
        
        var expired = date(d2).utcOffset("+07:00").format('MM-DD-YYYY HH:mm:ss');
        
        return expired;
    };

};

module.exports = DateFormatter;