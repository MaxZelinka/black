const discord = require("discord.js");
const event = require('../event');
const database = require('../database');
const _general = require('./_general');

/*
Autor:          Necromant
Date:           16.01.2020
Description:    Create General-Settings in the Database and more
*/

/*init*/
(function init() {
    event.add_event('ready', '_general', 'database');
    event.add_event('guildCreate', '_general', 'add_guild');
    event.add_event('guildDelete', '_general', 'del_guild');
    event.add_event('message', '_general', 'settings');
}());

exports.database = (client, args) => {
    database.query('CREATE TABLE IF NOT EXISTS `lpggbot_`.`_general` ( `Server_ID` varchar(20) NOT NULL PRIMARY KEY, `Moderator_ID` TEXT NULL, `Channel_ID` TEXT NULL  ) ENGINE = InnoDB;');
}

exports.add_guild = (client, args) => {
    database.query('INSERT INTO `lpggbot_`.`_general`(`Server_ID`) VALUES (' + args.guild.id + ');').then(rp => {
        if (rp.affectedRows) console.log('[modul] _general | create Database Entry for ' + args.guild.id);
    });
}

exports.del_guild = (client, args) => {
    database.query('DELETE FROM `lpggbot_`.`_general` WHERE `Server_ID`= ' + args.guild.id + ';').then(rp => {
        if (rp.affectedRows) console.log('[modul] _general | delete Database Entry for ' + args.guild.id);
    });
}

exports.isAdmin = (args) => {
    return (args.member.hasPermission('ADMINISTRATOR')) ? true : false;
}

exports.isMod = (args) => {
    return database.query('SELECT `Moderator_ID` FROM `lpggbot_`.`_general` WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
        if (rp) return (rp[0].Moderator_ID.replace(/[\s]/g, ' ').split(',').filter(x => x == args.member.id)[0]) ? true : false;
    })
}

exports.isChannel = (args) => {
    return args.match(/^<#!?([0-9]{18})>$/g) ? true : false;
}

exports.isRole = (args) => {
    return args.match(/^<@&([0-9]{18})>$/g) ? true : false;
}

exports.isUser = (args) => {
    return args.match(/^<@!?([0-9]{18})>$/g) ? true : false;
}

exports.isBot = (args) => {
    return args.member.user.bot;
}

exports.settings = (client, args) => {
    const argument = args.content.trim().split(/ +/g)
    const command = argument.shift().toLowerCase();

    if (_general.isAdmin(args) || _general.isMod(args)) {
        switch (command) {
            case '?baddmod':
                if (_general.isUser(argument[0])) {
                    database.query('SELECT `Moderator_ID` FROM `lpggbot_`.`_general` WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                        if (rp) {
                            var mods = (rp[0].Moderator_ID) ? rp[0].Moderator_ID.replace(/[\s]/g, ' ').split(',') : [];
                            var mods_new = (mods[0]) ? '\'' + mods.toString().replace(/[\s]/g, '') + ',' + argument[0].replace(/[<>@!]/g, '') + '\'' : argument[0].replace(/[<>@!]/g, '');
                            if (!mods.filter(x => x == argument[0].replace(/[<>@!]/g, ''))[0]) database.query('UPDATE `lpggbot_`.`_general` SET `Moderator_ID`= ' + mods_new + ' WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                                if (rp && rp.affectedRows) args.channel.send(new discord.RichEmbed()
                                    .setColor('000000')
                                    .setTitle('Successful')
                                    .setDescription('added Moderator [ ' + argument[0] + ' ]'))
                                    .then(msg => msg.delete(5000));
                            })
                        }
                    });
                }
                break;
            case '?bdelmod':
                if (_general.isUser(argument[0])) {
                    database.query('SELECT `Moderator_ID` FROM `lpggbot_`.`_general` WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                        if (rp) {
                            var mods = rp[0].Moderator_ID.replace(/[\s]/g, ' ').split(',');
                            if (mods.filter(x => x == argument[0].replace(/[<>@!]/g, ''))[0]) {
                                var mods_new = (mods.filter(x => x != argument[0].replace(/[<>@!]/g, ''))[0]) ? '\'' + mods.filter(x => x != argument[0].replace(/[<>@!]/g, '').toString().replace(/[\s]/g, ' ')) + '\'' : 'NULL';
                                database.query('UPDATE `lpggbot_`.`_general` SET `Moderator_ID`= ' + mods_new + ' WHERE `Server_ID` = ' + args.guild.id + ';').then(rp => {
                                    if (rp && rp.affectedRows) args.channel.send(new discord.RichEmbed()
                                        .setColor('000000')
                                        .setTitle('Successful')
                                        .setDescription('deleted Moderator [ ' + argument[0] + ' ]'))
                                        .then(msg => msg.delete(5000));
                                })
                            }
                        }
                    });
                }
                break;
            default:
                break;
        }
    }
}