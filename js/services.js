const NodeCache = require('node-cache'),
    fspromise = require('fs.promises');

const StatusCache = new NodeCache();

exports.start = async (client, modules) => {
    //start the services
    status_(client, modules);
    file_observer(modules);
}

async function status_(client, modules) {
    let status_text = (StatusCache.get('status')) ? StatusCache.get('status') : await modules.fspromise.readFile('./status.json', 'utf8').then(data => JSON.parse(data));
    if (!StatusCache.get('status')) StatusCache.set('status', status_text);
    modules.cron.schedule('* 2 * * *', () => {
        let rand = Math.round(Math.random() * (status_text.status.length - 1) + 0);
        client.user.setPresence({
            game: {
                name: (status_text.status[rand].game.name) ? status_text.status[rand].game.name : '',
                type: (status_text.status[rand].game.name) ? status_text.status[rand].game.type : '',
                url: (status_text.status[rand].game.name) ? status_text.status[rand].game.url : ''
            },
            status: (status_text.status[rand].status) ? status_text.status[rand].status : ''
        });
    });
    console.log('[service started] status');
}

async function file_observer(modules) {
    console.log('[service started] file observer');

    modules.cron.schedule('* * * 31 *', () => {
        modules.file.readdir('logs/').filter(f => modules.file.path.extname(f) == '.log' && modules.file.moment(f.replace(/(.log)/g, '')).isBefore(modules.file.moment().subtract(6, 'month'))).map(el => (modules.file.unlink(modules, 'logs/' + el)) ? console.log(`${el} was deleted.`) : '');
    });
}

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