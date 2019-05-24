const fs        = require('fs');

async function read_status_file(){
    return await fs.readFileSync('./status.json', 'utf8');
}

exports.set_status = async function(client){
   read_status_file().then(el => {
        el = JSON.parse(el);
        let rand = Math.round(Math.random() * (el.status.length - 1) + 0);
        client.user.setPresence({
            game: {
                 name: (el.status[rand].game.name !== undefined) ? el.status[rand].game.name : '',
                 type: (el.status[rand].game.name !== undefined) ? el.status[rand].game.type : '',
                 url:  (el.status[rand].game.name !== undefined) ? el.status[rand].game.url : ''
               },
               status: (el.status[rand].status !== undefined) ? el.status[rand].status : ''
           });
    }).catch(error => {
        console.log(error);
    })
}