const msg_send = require("../msg_send");
const db = require("../db");
const admin = require("../admin");
const Discord = require("discord.js");

exports.sample = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('sample', message)) {}
}

exports.prefix = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        await admin.hasPerm('prefix', message) === true) {
        if (args[0] !== undefined) {
            if (args[0].length <= 20) {
                if (args[0].match(/^[\w?!\-+*]*/gmi) !== null) {
                    db.query(`UPDATE general SET Prefix = '` + args[0] + `' WHERE ServerID = ` + message.guild.id + `;`).then(el => {
                        if (el !== undefined) {
                            msg_send.embedMessage(client, message.channel.id, 'Prefix', args[0], '000000');
                        } else {
                            msg_send.embedMessage(client, message.channel.id, 'Prefix', 'cant set prefix.', '#ff0000', 5000);
                        }
                    });
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Prefix', 'not allowed character. \n allowed: any digit & letter + ?!-+_*', '#ff0000', 5000);
                }
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Prefix', 'prefix exceeds the maximum length. (20)', '#ff0000', 5000);
            }
        } else {
            db.query(`SELECT Prefix FROM general WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(el => {
                if (el !== undefined) {
                    msg_send.embedMessage(client, message.channel.id, 'Prefix', el[0].Prefix, '000000');
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Prefix', 'cant get prefix.', '#ff0000', 5000);
                }
            });
        }
    }
}

exports.channel = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        await admin.hasPerm('channel', message) === true) {

        db.query(`SELECT Channel FROM config WHERE ServerID = '` + message.guild.id + `' LIMIT 1;`).then(get => {
            let arr_chn = (get[0].Channel.match(/[,]/gmi) !== null) ? get[0].Channel.split(',') : new Array[get[0].Channel]; //string to array
            if (get !== undefined) {
                if (args[0] !== undefined) {
                    if (admin.isChannel(args[0]) == true) {
                        const chn = args[0].replace(/[<#!>]/gmi, '');
                        arr_chn = (arr_chn.includes(chn)) ? arr_chn.filter(x => x !== chn) : arr_chn = [...arr_chn, chn];
                        //delete spaces
                        arr_chn = arr_chn.map(el => el.replace(/[ ]*/gm, ''));
                        arr_chn = arr_chn.filter(x => x !== '');

                        db.query(`UPDATE config SET Channel = '` + arr_chn.toString() + `' WHERE ServerID = '` + message.guild.id + `';`).then(set => {
                            if (set !== undefined) {
                                let channel = (arr_chn.length > 0) ? arr_chn.map(x => message.guild.channels.get(x.replace(' ', '')) + '\n') : '';
                                msg_send.embedMessage(client, message.channel.id, 'Channel', channel.toString().replace(/[,]/gmi, ''), '000000');
                            } else {
                                msg_send.embedMessage(client, message.channel.id, 'Channel', 'cant set channel.', '#ff0000', 5000);
                            }
                        });

                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Channel', 'argument isnt a channel.', '#ff0000', 5000);
                    }
                } else {
                    let channel = (arr_chn.length > 0) ? arr_chn.map(x => message.guild.channels.get(x.replace(' ', '')) + '\n') : '';
                    msg_send.embedMessage(client, message.channel.id, 'Channel', channel.toString().replace(/[,]/gmi, ''), '000000');
                }
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Channel', 'cant get/set channel.', '#ff0000', 5000);
            }
        });
    }
}

exports.mod = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        await admin.hasPerm('mod', message) === true) {

        db.query(`SELECT Moderator FROM config WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(async get => {
            if (get !== undefined) {
                let arr_mod = (get[0].Moderator.match(/[,]/gmi) !== null) ? get[0].Moderator.split(',') : new Array[get[0].Moderator]; //string to array
                if (args[0] !== undefined) {
                    //set
                    if (admin.isUser(args[0]) == true) {

                        const mod = args[0].replace(/[<@!>]/gmi, '');
                        arr_mod = (arr_mod.includes(mod)) ? arr_mod.filter(x => x !== mod) : arr_mod = [...arr_mod, mod];
                        //delete spaces
                        arr_mod = arr_mod.map(el => el.replace(/[ ]*/gm, ''));
                        arr_mod = arr_mod.filter(x => x !== '');

                        db.query(`UPDATE config SET Moderator = '` + arr_mod.toString() + `' WHERE ServerID = ` + message.guild.id + `;`).then(async set => {
                            if (set !== undefined) {
                                //only problems with spaces
                                arr_mod = await Promise.all(arr_mod.map(md => message.guild.fetchMember(md)));
                                msg_send.embedMessage(client, message.channel.id, 'Moderator', arr_mod.toString().replace(/[,]/gmi, '\n'), '000000');
                                /*
                                let moderator = (arr_mod.length > 0) ? arr_mod.map(x => '<@' + x.replace(/[ ]/gmi, '').replace(/[,]/gmi, '') + '>') : '';
                                msg_send.embedMessage(client, message.channel.id, 'Moderator', moderator.toString().replace(/[,]/gmi, '\n'), '000000');
                                */
                            } else {
                                msg_send.embedMessage(client, message.channel.id, 'Moderator', 'cant set moderator.', '#ff0000', 5000);
                            }
                        });
                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Moderator', 'argument isnt a user.', '#ff0000', 5000);
                    }
                } else {
                    //get
                    arr_mod = await Promise.all(arr_mod.map(md => message.guild.fetchMember(md)));
                    msg_send.embedMessage(client, message.channel.id, 'Moderator', arr_mod.toString().replace(/[,]/gmi, '\n'), '000000');
                }
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Moderator', 'cant get/set moderator.', '#ff0000', 5000);
            }
        });
    }
}

exports.botlog = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('botlog', message)) {
        if (args[0] !== undefined) {
            if (admin.isChannel(args[0]) === true) {
                db.query(`UPDATE config SET botlog = ` + args[0].replace(/[<#!>]/gm, '') + ` WHERE ServerID = ` + message.guild.id + `;`).then(el => {
                    if (el !== undefined) {
                        msg_send.embedMessage(client, message.channel.id, 'Botlog', args[0], '000000');
                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Botlog', 'cant set botlog.', '#ff0000', 5000);
                    }
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Botlog', 'argument isnt a channel.', '#ff0000', 5000);
            }
        } else {
            db.query(`SELECT botlog FROM config WHERE ServerID = ` + message.guild.id + `LIMIT 1;`).then(el => {
                console.log(el);
                if (el !== undefined) {
                    msg_send.embedMessage(client, message.channel.id, 'Botlog', el[0].botlog, '000000');
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Botlog', 'cant get botlog.', '#ff0000', 5000);
                }
            });
        }
    }
}

exports.modlog = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('modlog', message)) {
        if (args[0] !== undefined) {
            if (admin.isChannel(args[0]) === true) {
                db.query(`UPDATE config SET modlog = ` + args[0].replace(/[<#!>]/gm, '') + ` WHERE ServerID = ` + message.guild.id + `;`).then(el => {
                    if (el !== undefined) {
                        msg_send.embedMessage(client, message.channel.id, 'Modlog', args[0], '000000');
                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Modlog', 'cant set modlog.', '#ff0000', 5000);
                    }
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Modlog', 'argument isnt a channel.', '#ff0000', 5000);
            }
        } else {
            db.query(`SELECT botlog FROM config WHERE ServerID = ` + message.guild.id + `LIMIT 1;`).then(el => {
                if (el !== undefined) {
                    msg_send.embedMessage(client, message.channel.id, 'Modlog', el[0].modlog, '000000');
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Modlog', 'cant get modlog.', '#ff0000', 5000);
                }
            });
        }
    }
}

exports.blacklist = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('blacklist', message)) {}
}

exports.automod = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('automod', message)) {}
}

exports.welcome = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('welcome', message)) {}
}

exports.welcomemsg = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('welcomemsg', message)) {}
}

exports.leaverlog = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('leaverlog', message)) {}
}

exports.serverinfo = async (config, client, message) => {
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('serverinfo', message)) {

        const guild = message.guild;

        const timezones = {
            'brazil' : 'D/M/Y',
            'eu-central' : 'D/M/Y',
            'hongkong' : 'D/M/Y',
            'india' : 'D/M/Y',
            'japan' : 'Y/M/D',
            'russia' : 'D/M/Y',
            'singapore' : 'Y/M/D',
            'southafrica' : 'Y/M/D',
            'sydney' : 'D/M/Y',
            'us-central' : 'M/D/Y',
            'us-east' : 'M/D/Y',
            'us-south' : 'M/D/Y',
            'us-west' : 'M/D/Y',
            'eu-west' : 'D/M/Y'
          }

        const owner = guild.owner.user;
        const timeformat = (timezones.includes(guild.region)) ? timezones[guild.region] : 'D/M/Y';
        //const timeformat = 'D/M/Y';
        const createdAt = timeformat.replace(/D/gmi, guild.createdAt.getDate()).replace(/M/gmi, guild.createdAt.getMonth() + 1).replace(/Y/gmi, guild.createdAt.getUTCFullYear());
        const countroles = guild.roles.size;
        const online = guild.presences.size;
        const memberCount = guild.memberCount;
        const bots = guild.members.filter(el => el.user.bot == true).size;
        const member = guild.members.filter(el => el.user.bot == false).size;
        const channels = guild.channels.size;
        const textchannels = guild.channels.filter(el => el.type === 'text').size;
        const voicechannels = guild.channels.filter(el => el.type === 'voice').size;

        const exampleEmbed = new Discord.RichEmbed()
            .setColor('#000000')
            .setTitle('Server-Info')
            .addField('Owner', owner, true)
            .addField('Premium', false, true)
            .addField('Server created', createdAt, true)
            .addField('Total Roles', countroles, true)
            .addField('Total Members', memberCount + ' members (' + online + ' online)\n' + bots + ' bots  \n' + member + ' human ', true)
            .addField('Total Channels', channels + ' channels\n' + textchannels + ' text \n' + voicechannels + ' voice ', true);

        message.channel.send(exampleEmbed);
    }
}