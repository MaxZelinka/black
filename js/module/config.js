const msg_send = require("../msg_send");
const db = require("../db");
const admin = require("../admin");

/*
prefix: get/set prefix
channel: show | add/remove bot-channel
mod: show | add/remove bot-mod
botlog: show | add/remove botlog-channel
modlog: show | add/remove modlog-channel
blacklist: show | add/remove blacklist-user
automod: show | add/remove automod-channel
welcome: show | set welcome-channel
welcomemsg: show | set welcome-message
leaverlog: show | set leaverlog-channel
*/

exports.prefix = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        await admin.hasPerm('prefix', message) === true) {
        if (args[0] !== undefined) {
            if (args[0].length <= 20) {
                if (args[0].match(/^[\w?!\-+*]*/gmi) !== null) {
                    db.query(`UPDATE general SET Prefix = ` + args[0] + ` WHERE ServerID = ` + message.guild.id + `;`).then(el => {
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
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        await admin.hasPerm('channel', message) === true) {

        db.query(`SELECT Channel FROM config WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(get => {
            let arr_chn = (get[0].Channel.match(/[,]/gmi) !== null) ? get[0].Channel.split(',') : new Array[get[0].Channel]; //string to array
            if (get !== undefined) {
                if (args[0] !== undefined) {
                    if (admin.isChannel(args[0]) == true) {

                        if (arr_chn.indexOf(args[0].replace(/[<#!>]/gmi, '')) > 0) {
                            //delete
                            arr_chn.splice(arr_chn.indexOf(args[0].replace(/[<#!>]/gmi, '')), 1);
                        } else {
                            //add
                            arr_chn.push(args[0].replace(/[<#!>]/gmi,''));
                        }
                        arr_chn = arr_chn.filter(chn => chn !== '');

                        db.query(`UPDATE config SET Channel = '` + arr_chn.toString() + `' WHERE ServerID = ` + message.guild.id + `;`).then(set => {
                            if (set !== undefined) {
                                let channel = (arr_chn.length > 0) ? arr_chn.map(chn => message.guild.channels.get(chn.replace(' ','')) + '\n') : '';
                    msg_send.embedMessage(client, message.channel.id, 'Channel', channel.toString().replace(/[,]/gmi,''), '000000');
                            } else {
                                msg_send.embedMessage(client, message.channel.id, 'Channel', 'cant set channel.', '#ff0000', 5000);
                            }
                        });

                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Channel', 'argument isnt a channel.', '#ff0000', 5000);
                    }
                } else {
                    let channel = (arr_chn.length > 0) ? arr_chn.map(chn => message.guild.channels.get(chn.replace(' ','')) + '\n') : '';
                    msg_send.embedMessage(client, message.channel.id, 'Channel', channel.toString().replace(/[,]/gmi,''), '000000');
                }
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Channel', 'cant get/set channel.', '#ff0000', 5000);
            }
        });
    }
}

exports.mod = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        await admin.hasPerm('mod', message) === true) {

        db.query(`SELECT Moderator FROM config WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(get => {
            if (get !== undefined) {
                let arr_mod = (get.match(/[,]/gmi) !== null) ? get.split(',') : new Array[get]; //string to array
                if (args[0] !== undefined) {
                    //set
                    if (admin.isUser(args[0]) == true) {

                        if (get.indexOf(args[0].replace(/[<@!>]/gmi, '')) > 0) {
                            //delete
                            arr_mod.splice(arr_mod.indexOf(args[0].replace(/[<@!>]/gmi, '')), 1);
                        } else {
                            //add
                            arr_mod.push(args[0]);
                        }
                        arr_mod = arr_mod.filter(mod => mod !== '');

                        db.query(`UPDATE config SET Moderator = ` + arr_mod.toString() + ` WHERE ServerID = ` + message.guild.id + `;`).then(set => {
                            if (set !== undefined) {
                                let moderator = (arr_mod.length > 0) ? arr_mod.map(mod => message.guild.fetchMember(mod.trim()).name + '\n').toString() : '';
                                msg_send.embedMessage(client, message.channel.id, 'Moderator', moderator, '000000');
                            } else {
                                msg_send.embedMessage(client, message.channel.id, 'Moderator', 'cant set moderator.', '#ff0000', 5000);
                            }
                        });
                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Moderator', 'argument isnt a user.', '#ff0000', 5000);
                    }
                } else {
                    //get
                    let moderator = (arr_mod.length > 0) ? arr_mod.map(mod => message.guild.fetchMember(mod.trim()).name + '\n').toString() : '';
                    msg_send.embedMessage(client, message.channel.id, 'Moderator', moderator, '000000');
                }
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Moderator', 'cant get/set moderator.', '#ff0000', 5000);
            }
        });
    }
}

exports.sample = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('sample', message)) {}
}