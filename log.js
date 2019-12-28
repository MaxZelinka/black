const fs = require('fs');
const dir = './log/';
const moment = require('moment');

(function init() {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    } catch (err) {
        console.log(err);
    }
}());


exports.log = (val) => {
    try {
        if (fs.existsSync(dir)) {
            val = (typeof val == 'object') ? JSON.stringify(val) : val.toString();
            fs.appendFile(dir + moment().format('YYYY-MM') + '.log', moment().format('YYYY.MM.DD - HH:mm:ss') + '\t' + val + '\r\n', (err) => {
                if (err) console.log(err);
            });
        }
    } catch (err) {
        console.log('[cant save log]\n' + err);
    }
}