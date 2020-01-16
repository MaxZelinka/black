const discord = require("discord.js");
const event = require('../event');
const database = require('../database');
const _general = require('./_general');

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
    event.add_event('message', 'welcome', 'settings');
}());

let userlist = [];

exports.database = (client, args) => {
    database.query('CREATE TABLE `lpggbot_`.`welcome` ( `Server_ID` varchar(20) NOT NULL PRIMARY KEY, `Welcome_ID` VARCHAR(20) NULL , `Welcome_Role` varchar(20) NULL , `Leaver_ID` VARCHAR(20) NULL ) ENGINE = InnoDB;');
}

exports.add_guild = (client, args) => {
    database.query('INSERT INTO `lpggbot_`.`welcome`(`Server_ID`) VALUES (' + args.guild.id + ');').then(rp => {
        if (rp) console.log('[modul] Welcome | create Database Entry for ' + args.guild.id);
    });
}

exports.del_guild = (client, args) => {
    database.query('DELETE FROM `lpggbot_`.`welcome` WHERE `Server_ID`= ' + args.guild.id + ';').then(rp => {
        if (rp) console.log('[modul] Welcome | delete Database Entry for ' + args.guild.id);
    });
}

exports.settings = (client, args) => {
    const argument = args.content.trim().split(/ +/g)
    const command = argument.shift().toLowerCase();

    if (_general.isAdmin(args) || _general.isMod(args)) {
        switch (command) {
            case '?bwelcome':
                if (_general.isChannel(argument[0])) {
                    database.query('UPDATE `lpggbot_`.`welcome` SET `Welcome_ID`= ' + argument[0].replace(/[<>#!]/g, '') + ' WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                        if (rp && rp.affectedRows) args.channel.send(new discord.RichEmbed()
                            .setColor('000000')
                            .setTitle('Successful')
                            .setDescription('Welcome-Channel changed to [ ' + argument[0] + ' ]'))
                            .then(msg => msg.delete(5000));
                    })
                }
                break;
            case '?bleaver':
                if (_general.isChannel(argument[0])) {
                    database.query('UPDATE `lpggbot_`.`welcome` SET `Leaver_ID`= ' + argument[0].replace(/[<>#!]/g, '') + ' WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                        if (rp && rp.affectedRows) args.channel.send(new discord.RichEmbed()
                            .setColor('000000')
                            .setTitle('Successful')
                            .setDescription('Leaver-Channel changed to [ ' + argument[0] + ' ]'))
                            .then(msg => msg.delete(5000));
                    })
                }
                break;
            case '?bwelcome-role':
                if (_general.isRole(argument[0])) {
                    database.query('UPDATE `lpggbot_`.`welcome` SET `Welcome_Role`= ' + argument[0].replace(/[<>@&]/g, '') + ' WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                        if (rp && rp.affectedRows) args.channel.send(new discord.RichEmbed()
                            .setColor('000000')
                            .setTitle('Successful')
                            .setDescription('Welcome-Role changed to [ ' + argument[0] + ' ]'))
                            .then(msg => msg.delete(5000));
                    })
                }
                break;
            default:
                break;
        }
    }
}

function get_role(args) {
    return database.query('SELECT `Welcome_Role` FROM `lpggbot_`.`welcome` WHERE `Server_ID` = ' + args.guild.id + ';');
}

function get_welcome(args) {
    return database.query('SELECT `Welcome_ID` FROM `lpggbot_`.`welcome` WHERE `Server_ID` = ' + args.guild.id + ';');
}

function get_leaver(args) {
    return database.query('SELECT `Leaver_ID` FROM `lpggbot_`.`welcome` WHERE `Server_ID` = ' + args.guild.id + ';');
}

exports.welcome = (client, args) => {
    if (args && args.user && !args.user.bot) get_welcome(args).then(rp => {
        if (args.guild.channels.get(rp[0].Welcome_ID)) {
            const embed = new discord.RichEmbed()
                .setColor('000000')
                .setDescription('Willkommen ' + args.user + '!');

            client.guilds.get(args.guild.id).channels.get(rp[0].Welcome_ID).send({
                embed
            })
                .then(msg => {
                    userlist.push({
                        user_id: args.user.id,
                        username: args.user.username,
                        msg_id: msg.id
                    });
                });

            args.user.send(`Welcome to ` + args.guild.name + `!`);

            get_role(args).then(rp => {
                if (args.guild.roles.get(rp[0].Welcome_Role)) args.addRoles([rp[0].Welcome_Role]);
            })
        }
    });
}


exports.leaver = (client, args) => {
    get_welcome(args).then(rp => {
        if (args.guild.channels.get(rp[0].Welcome_ID)) {
            userlist.filter(member => member.user_id == args.user.id).map(member => {
                client.guilds.get(args.guild.id).channels.get(rp[0].Welcome_ID).fetchMessage(member.msg_id)
                    .then(msg => msg.delete());
            });
        }
    });

    get_leaver(args).then(rp => {
        if (args.guild.channels.get(rp[0].Leaver_ID)) {
            const embed = new discord.RichEmbed()
                .setColor('000000')
                .setDescription(args.user.username);

            client.guilds.get(args.guild.id).channels.get(rp[0].Leaver_ID).send({
                embed
            });
        }
    })
}