const event = require('../event');
const message = require('../message');

/*
Autor:          Necromant
Date:           24.12.2020
Description:    Send Welcome-Messages for new Members
*/

/*init*/
(function init() {
    event.add_event('guildMemberAdd', 'welcome', 'welcome');
}());

const channel = '312477482836295681';

exports.welcome = (client, args) => {
    if(args && args.user && !args.user.bot){
        message.send_embed_message(client, args.guild.id, channel, '#000', 'Willkommen', 'Willkommen ' + args.user + '!', 36000);
    }  
}