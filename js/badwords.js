const fs = require('fs');

async function read_badwords_file() {
    return await fs.readFileSync('./bad-words.txt', 'utf8');
}

exports.get_badwords = async function () {
    return read_badwords_file().then(el => {
        return el.split('\r\n');
    }).catch(error => {
        console.log(error);
    })
}