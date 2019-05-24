const moment    = require('moment');
const fs        = require('fs');

exports.log = function(data){
    fs.appendFile('./logs/' + moment().format('YYYY-MM') + '.log', moment().format('YYYY.MM.DD - HH:mm:ss') + '\t' + data + '\r\n', function (err) {
        if (err) throw err;
    });
}