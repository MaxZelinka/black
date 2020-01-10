const discord = require("discord.js");
const event = require('../event');

/*
Autor:          Necromant
Date:           10.01.2020
Description:    Send Welcome-Messages for new Members
*/

/*init*/
(function init() {
    event.add_event('guildMemberAdd', 'welcome', 'welcome');
    event.add_event('guildMemberRemove', 'welcome', 'leaver');
}());

const welcome_channel = '312477482836295681';
const leaver_channel = '513444670123147276';
const role = '425584194522054656';

let userlist = [];

exports.welcome = (client, args) => {
    if (args && args.user && !args.user.bot) {
        const embed = new discord.RichEmbed()
            .setColor('[44, 47, 51]')
            .setDescription('Willkommen ' + args.user + '!');

        client.guilds.get(args.guild.id).channels.get(welcome_channel).send({
                embed
            })
            .then(msg => {
                userlist.push({
                    user_id: args.user.id,
                    username: args.user.username,
                    msg_id: msg.id
                });
            });

        if (args.guild.roles.get(role)) args.addRoles([role]);
    }
}

exports.leaver = (client, args) => {
    userlist.filter(member => member.user_id == args.user.id).map(member => {
        client.guilds.get(args.guild.id).channels.get(welcome_channel).fetchMessage(member.msg_id)
            .then(msg => msg.delete());
    });

    const embed = new discord.RichEmbed()
        .setColor('[44, 47, 51]')
        .setDescription(args.user);

    client.guilds.get(args.guild.id).channels.get(leaver_channel).send({
        embed
    });
}