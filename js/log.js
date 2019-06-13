const moment = require('moment');
const fs = require('fs');

const dir = './logs/';

exports.log = function (data) {
    fs.appendFile(dir + moment().format('YYYY-MM') + '.log', moment().format('YYYY.MM.DD - HH:mm:ss') + '\t' + data + '\r\n', function (err) {
        if (err) throw err;
    });
    del_file();
}

function del_file() {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            if (file.match(/\d{4}-\d{2}.\blog\b/gm) !== null) {
                const date = file.replace(/.\blog\b/gm, '');
                const ago = moment().subtract(6, 'month');
                if (moment(date).isBefore(ago)) {
                    fs.unlink(dir + file, (err) => {
                        if (err) throw err;
                        console.log(dir + file + ' deleted.');
                    });
                }
            }
        });
    });
}