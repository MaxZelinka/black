const Discord = require("discord.js"),
    client = new Discord.Client(),
    NodeCache = require('node-cache'),
    fspromise = require('fs.promises');

const StatusCache = new NodeCache({
    stdTTL: 86400 //24H ttl
});

exports.set_status = async () => {
    fspromise.readFile('config.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(data => {
            setInterval(status, data.statusIntervall);
            console.log('[service started] status');
        })
        .catch(err => console.log(err));
}

async function status() {
    let status_text = (StatusCache.get('status')) ? StatusCache.get('status') : await fspromise.readFile('status.json', 'utf8').then(data => JSON.parse(data));
    if (!StatusCache.get('status')) StatusCache.set('status', status_text);

    let rand = Math.round(Math.random() * (status_text.status.length - 1) + 0);
    client.user.setPresence({
        game: {
            name: (el.status[rand].game.name) ? el.status[rand].game.name : '',
            type: (el.status[rand].game.name) ? el.status[rand].game.type : '',
            url: (el.status[rand].game.name) ? el.status[rand].game.url : ''
        },
        status: (el.status[rand].status) ? el.status[rand].status : ''
    });
}