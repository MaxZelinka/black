const fspromise = require('fs.promises');
const mysql = require('promise-mysql');
const log = require("./log");

(function init() {

}());

exports.query = (query) => {

    try {
        fspromise.readFile('./config/config.json', 'utf8')
            .then(data => JSON.parse(data))
            .then(data => mysql.createConnection({
                host: data.db.servername,
                user: data.db.username,
                password: data.db.password,
                database: data.db.dbname
            }))
            .then(data => {
                data.query(query).then(result => {
                    console.log(result);
                });
                data.end();             
            })
            .catch(error => log.log('[get_fileconfig] - ' + error));
    } catch (err) {
        log.log(err);
    }
}