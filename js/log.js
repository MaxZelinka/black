/**************************************************************************************************************/
/* LOG SYSTEM                                                                                                 */
/**************************************************************************************************************/

/*
Required modules:
 - moment
 - fs
*/

const moment = require('moment'),
    fs = require('fs');

const dir = './logs/';

exports.log_ = (modules, data) => {
    console.log(data);
    try {
        if (modules.fs.existsSync(dir)) modules.fs.mkdirSync(dir);
        data = (typeof data == 'object') ? JSON.stringify(data) : data.toString();
        let filename = `${dir + modules.moment().format('YYYY-MM')}.log`;
        let value = `${modules.moment().format('YYYY.MM.DD - HH:mm:ss')}\t${data}\r\n`;
        modules.fs.appendFileSync(filename, value);
    } catch (err) {
        console.log(err);
    }
    del_(modules);
}

function del_(modules) {
    try {
        modules.file.readdir(modules, dir).forEach(file => {
            if (file.match(/\d{4}-\d{2}.\blog\b/gm)) {
                if (modules.moment(file.replace(/.\blog\b/gm, '')).isBefore(modules.moment().subtract(6, 'month'))) {
                    if (!modules.file.unlink(modules, dir + file)) {
                        console.log(`${file} not deleted.`);
                    }
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

/********************/

exports.log = function (data) {
    console.log(data);

    try {
        data = (typeof data == 'object') ? JSON.stringify(data) : data.toString();
        fs.appendFile(dir + moment().format('YYYY-MM') + '.log', moment().format('YYYY.MM.DD - HH:mm:ss') + '\t' + data + '\r\n', function (err) {
            if (err) throw err;
        });
    } catch (err) {
        console.log('[cant save log]\n' + err);
    }

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