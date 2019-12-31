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
    event.add_event('guildMemberRemove', 'welcome', 'leaver');
}());

const channel = '312477482836295681';
const role = '425584194522054656';

let userlist = [];

exports.welcome = (client, args) => {
    if (args && args.user && !args.user.bot) {
        // message.send_embed_message(client, args.guild.id, channel, '#000', 'Willkommen', 'Willkommen ' + args.user.name + '!');

        const embed = new discord.RichEmbed()
            .setDescription('Willkommen ' + args.user.name + '!');

        client.guilds.get(args.guild.id).channels.get(channel).send({ embed }).then(msg => {
            let user = {
                user_id: args.user.id,
                username: args.user.username,
                msg_id: msg.id
            }
            userlist.push(user);
        });

        if (args.guild.roles.get(role)) args.addRoles([role]);
    }
}

exports.leaver = (client, args) => {
    userlist.filter(member => {
        if (member.user_id == args.user.id) {
            client.guilds.get('581147107033874455').channels.get('581147107487121439').fetchMessage(member.msg_id)
                .then(msg => msg.delete());
        }
    });
}