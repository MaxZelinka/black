const fs = require('fs');
const fspromise = require('fs.promises');
const naturalCompare = require('natural-compare');

const path = './_module/';
let modules = {}
const options = "./config/modul.json";

(function init() {
    return new Promise(function (resolve, reject) {
        try {
            fspromise.readdir(path, 'utf8')
                .then(files => files.sort((a, b) => naturalCompare(a, b)))
                .then(files => get_modul_option(files).then((resolve) => {
                    return files.filter(file => resolve[file.replace('.js', '')] || resolve[file.replace('.js', '')] == undefined);
                }))
                .then(files => {
                    // set_modul_option(files);
                    files.map(file => {
                        modules[file.replace('.js', '')] = require(path + file);
                        console.log('[start modul] ' + file.replace('.js', ''));
                    });
                    resolve(modules);
                })
                .catch(err => reject(err));
        } catch (err) {
            resolve(false);
            reject(err);
        }
    });
}());

exports.get_module = () => {
    return modules;
}

function get_modul_option() {
    return new Promise(function (resolve) {
        if (fs.existsSync(options)) {
            fspromise.readFile(options, 'UTF-8').then(val => resolve(JSON.parse(val)));
        } else {
            resolve('{}');
        }
    });
}

function set_modul_option(files) {
    if (!fs.existsSync(options)) {
        let obj = {};
        files.map(file => obj[file.replace('.js', '')] = 1);
        fspromise.writeFile(options, JSON.stringify(obj));
    } else {
        fspromise.readFile(options, 'UTF-8').then(val => {

            files.map(file => {
                // console.log(file);
            });

            // Object.keys(JSON.parse(val)) -> array
            // files ->

            // let obj = JSON.parse(val);

            // Object.keys(obj).map(conf => {
            //     files.map((file, index) => {
            //         if (file.replace('.js', '') == conf) {
            //             files.splice(index);
            //         } else {
            //             obj[file.replace('.js', '')] = 1;
            //             fspromise.writeFile(options, JSON.stringify(obj));
            //         }
            //     })
            // });

            // console.log(obj);
        })
    }
}
