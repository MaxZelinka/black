const fspromise = require('fs.promises');
const mysql = require('promise-mysql');
const log = require("./log");

(function init() {

}());

exports.query = (query) => {
    try {
        return fspromise.readFile('./config/config.json', 'utf8')
            .then(data => JSON.parse(data))
            .then(data => mysql.createConnection({
                host: data.db.servername,
                user: data.db.username,
                password: data.db.password,
                database: data.db.dbname
            }))
            .then(data => {
                return data.query(query).then(result => {
                    data.end();
                    return result;
                }).catch(err => {
                    log.log(err);
                    data.end();
                });
            })
            .catch(err => log.log(err));
    } catch (err) {
        log.log(err);
    }
}