const msg_send = require("../msg_send"),
    db = require("../db"),
    admin = require("../admin");

exports.prefix = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
        if (args[0]) {
            if (args[0].length <= 20) {
                if (args[0].match(/^[\w?!\-+*]*/gmi) !== null) {
                    db.query(`UPDATE general SET Prefix = '${args[0]}' WHERE ServerID = ${message.guild.id};`).then(el => {
                        if (el) {
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
            db.query(`SELECT Prefix FROM general WHERE ServerID = ${message.guild.id} LIMIT 1;`).then(el => {
                if (el) {
                    msg_send.embedMessage(client, message.channel.id, 'Prefix', el[0].Prefix, '000000');
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Prefix', 'cant get prefix.', '#ff0000', 5000);
                }
            });
        }
    }
}

exports.channel = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {

        db.query(`SELECT Channel FROM config WHERE ServerID = '` + message.guild.id + `' LIMIT 1;`).then(get => {
            let arr_chn;
            if (get[0].Channel !== null) {
                arr_chn = (get[0].Channel.match(/[,]/gmi) !== null) ? get[0].Channel.split(',') : new Array(get[0].Channel); //string to array
            }
            if (get) {
                if (args[0]) {
                    if (admin.isChannel(args[0])) {
                        const chn = args[0].replace(/[<#!>]/gmi, '');
                        if (get[0].Channel !== null) {
                            arr_chn = (arr_chn.includes(chn)) ? arr_chn.filter(x => x !== chn) : arr_chn = [...arr_chn, chn];
                            //delete spaces
                            arr_chn = arr_chn.map(el => el.replace(/[ ]*/gm, ''));
                            arr_chn = arr_chn.filter(x => x !== '');
                        } else {
                            arr_chn = new Array(chn);
                        }
                        db.query(`UPDATE config SET Channel = '` + arr_chn.toString() + `' WHERE ServerID = '` + message.guild.id + `';`).then(set => {
                            if (set !== undefined) {
                                let channel = (arr_chn.length > 0) ? arr_chn.map(x => message.guild.channels.get(x.replace(' ', '')) + '\n') : '';
                                channel = (channel !== '') ? channel : 'empty';
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
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
        db.query(`SELECT Moderator FROM config WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(async get => {
            if (get) {
                let arr_mod = (get[0].Moderator.match(/[,]/gmi) !== null) ? get[0].Moderator.replace(' ', '').split(',') : new Array[get[0].Moderator]; //string to array
                if (args[0]) {
                    //set
                    if (admin.isUser(args[0])) {

                        const mod = args[0].replace(/[<@!>]/gmi, '');
                        arr_mod = (arr_mod.includes(mod)) ? arr_mod.filter(x => x !== mod) : arr_mod = [...arr_mod, mod];
                        //delete spaces
                        arr_mod = arr_mod.map(el => el.replace(/[ ]*/gm, ''));
                        arr_mod = arr_mod.filter(x => x !== '');

                        db.query(`UPDATE config SET Moderator = '` + arr_mod.toString() + `' WHERE ServerID = ` + message.guild.id + `;`).then(async set => {
                            if (set) {
                                //only problems with spaces
                                arr_mod = await Promise.all(arr_mod.map(md => message.guild.fetchMember(md)));
                                msg_send.embedMessage(client, message.channel.id, 'Moderator', arr_mod.toString().replace(/[,]/gmi, '\n'), '000000');

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
    const args = await admin.cut_cmd(message);
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
            db.query(`SELECT botlog FROM config WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(async el => {
                if (el !== undefined) {
                    const channel = await admin.get_channel(client, el[0].botlog);
                    msg_send.embedMessage(client, message.channel.id, 'Botlog', channel.toString(), '000000');
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Botlog', 'cant get botlog.', '#ff0000', 5000);
                }
            });
        }
    }
}

exports.modlog = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
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
            db.query(`SELECT modlog FROM config WHERE ServerID = ` + message.guild.id + ` LIMIT 1;`).then(async el => {
                if (el !== undefined) {
                    const channel = await admin.get_channel(client, el[0].modlog);
                    msg_send.embedMessage(client, message.channel.id, 'Modlog', channel.toString(), '000000');
                } else {
                    msg_send.embedMessage(client, message.channel.id, 'Modlog', 'cant get modlog.', '#ff0000', 5000);
                }
            });
        }
    }
}

exports.blacklist = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('blacklist', message)) {

        db.query(`SELECT blacklist FROM config WHERE ServerID = '` + message.guild.id + `' LIMIT 1;`).then(get => {
            let arr_black;
            if (get[0].blacklist !== null) {
                arr_black = (get[0].blacklist.match(/[,]/gmi) !== null) ? get[0].blacklist.split(',') : new Array(get[0].blacklist); //string to array
            }
            if (get !== undefined) {
                if (args[0] !== undefined) {
                    //set
                } else {
                    //get
                    let user = (arr_black.length > 0) ? arr_black.map(x => message.guild.members.get(x.replace(' ', '')) + '\n') : '';
                    msg_send.embedMessage(client, message.channel.id, 'Blacklist', user.toString().replace(/[,]/gmi, ''), '000000');
                }
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Blacklist', 'cant get/set user.', '#ff0000', 5000);
            }

        });
    }
}

exports.automod = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('automod', message)) {}
}

exports.welcome = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('welcome', message)) {}
}

exports.welcomemsg = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('welcomemsg', message)) {}
}

exports.leaverlog = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('leaverlog', message)) {}
}