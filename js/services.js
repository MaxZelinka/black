const NodeCache = require('node-cache'),
    fspromise = require('fs.promises');

const StatusCache = new NodeCache({
    stdTTL: 86400 //24H ttl
});

exports.set_status = async (client, modules) => {
    modules.fspromise.readFile('./config.json', 'utf8')
        .then(data => JSON.parse(data))
        .then(() => {
            status(client);
            //setInterval(status, data.statusIntervall);
            console.log('[service started] status');
        })
        .catch(err => console.log(err));
}

async function status(client) {
    let status_text = (StatusCache.get('status')) ? StatusCache.get('status') : await fspromise.readFile('./status.json', 'utf8').then(data => JSON.parse(data));
    if (!StatusCache.get('status')) StatusCache.set('status', status_text);
    let rand = Math.round(Math.random() * (status_text.status.length - 1) + 0);
    client.user.setPresence({
        game: {
            name: (status_text.status[rand].game.name) ? status_text.status[rand].game.name : '',
            type: (status_text.status[rand].game.name) ? status_text.status[rand].game.type : '',
            url: (status_text.status[rand].game.name) ? status_text.status[rand].game.url : ''
        },
        status: (status_text.status[rand].status) ? status_text.status[rand].status : ''
    });
}