const fspromise = require('fs.promises');
const naturalCompare = require('natural-compare');

const path = './_module/';
let modules = {}

exports.init = () => {
    return new Promise(function (resolve, reject) {
        try {
            fspromise.readdir(path, 'utf8')
                .then(files => files.sort((a, b) => naturalCompare(a, b)))
                .then(files => {
                    files.map(file => modules[file.replace('.js', '')] = require(path + file));
                    resolve(modules);
                })
                .catch(err => reject(err));
        } catch (err) {
            resolve(false);
            reject(err);
        }
    });
}