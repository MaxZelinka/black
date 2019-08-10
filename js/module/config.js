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

exports.blacklist = async (config, client, modules, cache, message) => {
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
        const args = await admin.cut_cmd(message);
        if (args[0]) {
            if (modules.admin.isUser(args[0])) {
                const user = args[0].replace(/[<@!>]/gm, '');
                args.shift();
                const reason = args.toString().replace(/[,]/gm, ' ');
                modules.db.query(`SELECT * FROM blacklist WHERE server_id = ${message.guild.id} AND user_id = ${user}`).then(get => {
                    const query = (get[0]) ? `DELETE FROM blacklist WHERE server_id = ${message.guild.id} AND user_id = ${user}`
                        : `INSERT INTO blacklist (server_id, user_id, reason) VALUES ('${message.guild.id}', '${user}', '${reason}');`;
                    const msg = (get[0]) ? `<@${user}> is not longer blocklistet from using commands at your server.` : `<@${user}> is now blocklistet from using commands at your server.`;
                    modules.db.query(query).then(modules.msgsend.embedMessage(client, message.channel.id, 'Blacklist', msg, '#000000')).catch(err => {
                        modules.msgsend.embedMessage(client, message.channel.id, 'Blacklist', 'oops smth went wrong :(', '#ff0000', 5000);
                        modules.log.log(err);
                    });
                });
            } else {
                modules.msgsend.embedMessage(client, message.channel.id, 'Blacklist', args[0] + ' isnt an user.', '#ff0000', 5000);
            }
        } else {
            modules.db.query(`SELECT * FROM blacklist WHERE server_id = ${message.guild.id}`).then(get => {
                const msg = (get[0]) ? get.map(el => `<@${el.user_id}> (${el.time})\n ${el.reason}\n\n`).toString().replace(/[,]/gm, '') : 'empty';
                modules.msgsend.embedMessage(client, message.channel.id, 'Blacklist', msg, '#000000');
            }).catch(err => {
                modules.msgsend.embedMessage(client, message.channel.id, 'Blacklist', 'cant get/set user.', '#ff0000', 5000);
                modules.log.log(err);
            });
        }
    }
}

exports.automod = async (config, client, modules, cache, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('automod', message)) { }
}

exports.welcome = async (config, client, modules, cache, message) => {
    if (modules.admin.isAdmin(message) || modules.admin.isMod(message, config)) {
        const args = await modules.admin.cut_cmd(message);
        if (args[0]) {
            const channel = args[0].replace(/[<!#>]/gm, '');
            if (modules.admin.isChannel(args[0])) {
                modules.db.query(`UPDATE welcome SET welcome_channel = ${channel} WHERE ServerID = ${message.guild.id};`).then(update => {
                    if (update.affectedRows == 0) {
                        modules.db.query(`INSERT INTO welcome (ServerID, welcome_channel) VALUES (${message.guild.id}, ${channel});`).then(insert => {
                            modules.msgsend.embedMessage(client, message.channel.id, 'Welcome', 'welcome-channel set.', '#000000');
                        }).catch(err => modules.msgsend.error(modules, client, message, message.channel.id, 'Welcome', err));
                    } else {
                        modules.msgsend.embedMessage(client, message.channel.id, 'Welcome', 'welcome-channel changed.', '#000000');
                    }
                }).catch(err => modules.msgsend.error(modules, client, message, message.channel.id, 'Welcome', err));
            } else {
                modules.msgsend.embedMessage(client, message.channel.id, 'Welcome', args[0] + ' isnt an channel.', '#ff0000', 5000);
            }
        } else {
            modules.db.query(`SELECT welcome_channel FROM welcome WHERE ServerID = ${message.guild.id};`).then(select => {
                modules.msgsend.embedMessage(client, message.channel.id, 'Welcome', `welcome-channel: <#${select[0].welcome_channel}>`, '#000000');
            }).catch(err => modules.msgsend.error(modules, client, message, message.channel.id, 'Welcome', err));
        }
    }
}

exports.welcomemsg = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('welcomemsg', message)) { }
}

exports.leaverlog = async (config, client, message) => {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('leaverlog', message)) { }
}