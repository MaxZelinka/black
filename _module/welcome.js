const discord = require("discord.js");
const event = require('../event');
const database = require('../database');

/*
Autor:          Necromant
Date:           14.01.2020
Description:    Send Welcome-Messages for new Members
*/

/*init*/
(function init() {
    event.add_event('ready', 'welcome', 'database');
    event.add_event('guildCreate', 'welcome', 'add_guild');
    event.add_event('guildDelete', 'welcome', 'del_guild');
    event.add_event('guildMemberAdd', 'welcome', 'welcome');
    event.add_event('guildMemberRemove', 'welcome', 'leaver');
    // event.add_event('message', 'welcome', 'settings');
}());

const welcome_channel = '312477482836295681';
const leaver_channel = '513444670123147276';
const role = '425584194522054656';
const welcome_msg = `Willkommen auf LetsPlayGreatGames!`;

let userlist = [];

exports.database = (client, args) => {
    database.query('CREATE TABLE `lpggbot_`.`welcome` ( `Server_ID` varchar(20) NOT NULL PRIMARY KEY, `Welcome_ID` VARCHAR(20) NULL , `Welcome_msg` varchar(255) NULL , `Leaver_ID` VARCHAR(20) NULL ) ENGINE = InnoDB;');
}

exports.add_guild = (client, args) => {
    database.query('INSERT INTO `lpggbot_`.`welcome`(`Server_ID`) VALUES (' + args.guild.id + ');').then(rp => {
        if (rp) console.log('[modul] Welcome | create Database Entry for ' + args.guild.id);
    });
}

exports.del_guild = (client, args) => {
    database.query('DELETE FROM `welcome` WHERE `Server_ID`= ' + args.guild.id + ';').then(rp => {
        if (rp) console.log('[modul] Welcome | delete Database Entry for ' + args.guild.id);
    });
}

exports.settings = (client, args) => {
    const argument = args.content.trim().split(/ +/g)
    const command = argument.shift().toLowerCase();

    if (args.member.hasPermission('ADMINISTRATOR')) {

        //?bwelcome 1
        //?bwelcome == command
        //['1'] = argument[0]

        switch (command) {
            case '?bwelcome':
                set_welcome();
                break;
            case '?bleaver':
                set_leaver();
                break;
            case '?brole':
                set_role();
                break;
            default:
                break;
        }
    }

    function set_welcome() {
        if (argument[0].match(/<#[0-9]*>/g) !== null) {
            // database.query('INSERT INTO welcome (welcome_channel) VALUES (' + argument[0] + ');').then(result => {
            //     console.log(result);
            // });
        }
    }
    function set_leaver() { }
    function set_role() { }
}

exports.welcome = (client, args) => {
    if (args && args.user && !args.user.bot) {
        const embed = new discord.RichEmbed()
            .setColor('[0, 0, 0]')
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

        args.user.send(welcome_msg);
        if (args.guild.roles.get(role)) args.addRoles([role]);
    }
}

exports.leaver = (client, args) => {
    userlist.filter(member => member.user_id == args.user.id).map(member => {
        client.guilds.get(args.guild.id).channels.get(welcome_channel).fetchMessage(member.msg_id)
            .then(msg => msg.delete());
    });

    const embed = new discord.RichEmbed()
        .setColor('[0, 0, 0]')
        .setDescription(args.user);

    client.guilds.get(args.guild.id).channels.get(leaver_channel).send({
        embed
    });
}