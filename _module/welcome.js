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
const role    = '425584194522054656';

exports.welcome = (client, args) => {
    if(args && args.user && !args.user.bot){
        message.send_embed_message(client, args.guild.id, channel, '#000', 'Willkommen', 'Willkommen ' + args.user + '!');
        if(args.guild.roles.get(role)) args.addRoles([role]);
    }  
}

exports.leaver = () => {
    // client.guilds.get('312477482836295681').fetchMember('287281691746238464').then(el => {

    //     const now = moment();
    
    //     if(now.subtract('1','hour').toISOString() > now.subtract('2','hour').toISOString()){
    //       console.log(now.subtract('1','hour').toISOString());
    //     }
    
       
    
    //     // console.log(moment(el.joinedTimestamp).add('7','years').toISOString());
    //   })
}