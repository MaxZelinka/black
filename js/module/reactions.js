const punycode = require('punycode'),
    Discord = require("discord.js");

const db = require("../db"),
    log = require("../log"),
    admin = require("../admin"),
    msg_send = require("../msg_send");

exports.addrole = async (config, client, message) => {
    const args = admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
        if (args[0] !== undefined &&
            admin.isChannel(args[0]) &&
            args[1] &&
            args[2] &&
            args[3]) {

            const channelID = args[0].replace(/[<#>]/gm, ''),
                messageID = args[1],
                emoteID = punycode.encode((args[2].match(/[<>]/gm)) ? args[2].replace(/^<>/gm, '') : args[2]),
                roleID = args[3].replace(/[<@&>]/gm, '');

            if (await message.guild.roles.find(el => el.id == roleID)) {
                admin.get_message(client, channelID, messageID).then((found) => {
                    db.set_reaction(message.guild, channelID, messageID, emoteID, roleID).then((reaction_ID) => {
                        if (reaction_ID !== undefined) {
                            let reaction = (args[2].match(/[<>]/gm) !== null) ? args[2].replace(/^<>/gm, '') : args[2];
                            found.react(reaction);
                            const link = 'https://discordapp.com/channels/' + message.guild.id + '/' + channelID + '/' + messageID;
                            msg_send.embedMessage(client, message.channel.id, 'Reaction', 'created.\nReaction_ID: ' + reaction_ID[0].reactionsID + '\n' + link, '000000');
                        } else {
                            msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant create reaction. Double Entry?', '#ff0000', 5000);
                        }
                    }).catch((error) => {
                        console.log(error);
                        msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant create reaction.', '#ff0000', 5000);
                    });
                }).catch((error) => {
                    console.log(error);
                    msg_send.embedMessage(client, message.channel.id, 'Reaction', 'wrong channel-ID or message-ID.', '#ff0000', 5000);
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Reaction', 'no permission. Role-Owner: Discord', '#ff0000', 5000);
            }
        } else {
            msg_send.embedMessage(client, message.channel.id, 'Reaction', 'missing arguments.', '#ff0000', 5000);
        }
    }
}

exports.removerole = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('removerole', message)) {
        if (args[0] !== undefined) {
            db.query(`SELECT * FROM reactions WHERE ServerID = ` + message.guild.id + ` AND reactionsID = ` + args[0] + `;`).then(async role => {
                const msg = await message.guild.channels.get(role[0].ChannelID).fetchMessage(role[0].MessageID);
                msg.reactions.get(punycode.decode(role[0].EmoteID)).remove(client.user.id);
                db.query(`DELETE FROM reactions WHERE ServerID = ` + message.guild.id + ` AND reactionsID = ` + args[0] + `;`).then(response => {
                    if (response !== undefined) {
                        msg_send.embedMessage(client, message.channel.id, 'Reaction', 'reaction deleted.', '#000000');
                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant delete reaction.', '#ff0000', 5000);
                    }
                });
            });
        } else {
            msg_send.embedMessage(client, message.channel.id, 'Reaction', 'missing arguments.', '#ff0000', 5000);
        }
    }
}

exports.reactionid = async (config, client, message) => {
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('reactionid', message) === true) {
        db.query(`SELECT * FROM reactions WHERE ServerID = ` + message.guild.id + `;`).then(response => {
            if (response !== undefined) {

                let ReactionsEmbed = new Discord.RichEmbed()
                    .setColor('#000000')
                    .setTitle('Reaction IDs')
                    .setDescription('\u200b');

                let count = 0;
                let rest = response.length;
                response.map(el => {
                    count++;
                    const link = 'https://discordapp.com/channels/' + message.guild.id + '/' + el.ChannelID + '/' + el.MessageID;

                    //const emote = (el.EmoteID.includes(':')) ? '<:' + el.EmoteID + '>' : el.EmoteID;
                    const emote = punycode.decode(el.EmoteID);
                    ReactionsEmbed.addField(el.reactionsID + ' ' + emote + ' - ' +
                        message.guild.channels.get(el.ChannelID).name.toString() + ' - ' +
                        message.guild.roles.get(el.RoleID).name.toString(), link);
                    if (count == 25 || count == response.length || count == rest) {
                        client.channels.get(message.channel.id).send(ReactionsEmbed);
                        ReactionsEmbed = new Discord.RichEmbed()
                            .setColor('#000000')
                            .setTitle('Reaction IDs')
                            .setDescription('\u200b');
                        count = 0;
                        rest = rest - 25;
                    }
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant read reaction.', '#ff0000', 5000);
            }
        });
    }
}

exports.embedmsg = async (config, client, message) => {
    //?bembedmsg #💰-server-support #000 "Support" "We are grateful for every support we can get. :)" "img"
    const args = message.content.trim().split(/ +/g);
    args.shift();
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('embedmsg', message) === true) {

        const regex_embedmessage_cmd = new RegExp('^<#\\d{18}> *#([\\dA-F]){3,6} *("[^"]*" *){2}', 'gmi');
        const regex_rest = new RegExp('("[^"]*")', 'gm');
        const content = message.content.substring(message.content.indexOf(' ') + 1);
        const rest = content.match(regex_rest);

        if (content.match(regex_embedmessage_cmd) !== null &&
            rest !== null) {
            if (rest[0].length <= 1026 && rest[1].length <= 1026) {
                let channel = args[0].replace(/[<#!>]/gmi, '');
                let colorcode = parseInt(args[1].replace(/[#]/gm, ''), 16);

                client.channels.get(channel).send({
                    embed: {
                        color: colorcode,
                        fields: [{
                            name: rest[0].replace(/\"/gm, ''),
                            value: rest[1].replace(/\"/gm, '')
                        }]
                    }
                }).then((msg) => {
                    let link = 'https://discordapp.com/channels/' + message.guild.id + '/' + channel + '/' + msg.id;
                    msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'created. \n' + link, '#000000');
                }).catch((error) => {
                    log.log('[embedmsg] - ' + message.guild.id + ' : ' + error);
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'max chars:\n title: 1024 \n body: 1024', '#ff0000', 5000);
            }
        } else {
            msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'missing arguments.', '#ff0000', 5000);
        }
    }
}

exports.editmsg = async (config, client, message) => {
    const args = message.content.trim().split(/ +/g);
    args.shift();
    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('embedmsg', message) === true) {

        const regex_editmsg_cmd = new RegExp('^<#[\\d]{18}> *[\\d]{18} *(\\bTitle\\b|\\bBody\\b) *("[^"]*")', 'gim');
        const regex_rest = new RegExp('(\\bTitle\\b|\\bBody\\b) *("[^"]*")', 'gim');
        const content = message.content.substring(message.content.indexOf(' ') + 1);
        const rest = content.match(regex_rest);

        if (content.match(regex_editmsg_cmd) !== null && rest !== null) {
            const mod = rest.toString().match(/(^[^"]*)/g).toString().trim().toLowerCase();
            const val = rest.toString().match(/("[^"]*")/g).toString().replace(/["]/g, '');
            const channelID = args[0].replace(/[<#>]/g, '');

            if (val.length <= 1024) {
                client.channels.get(channelID).fetchMessage(args[1]).then((msg) => {
                    msg.edit({
                        embed: {
                            color: msg.embeds[0].color,
                            fields: [{
                                name: (mod === 'title') ? val : msg.embeds[0].fields[0].name,
                                value: (mod === 'body') ? val : msg.embeds[0].fields[0].value
                            }]
                        }
                    }).then(() => {
                        let link = 'https://discordapp.com/channels/' + message.guild.id + '/' + channelID + '/' + msg.id;
                        msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'edited.\n' + link, '#000000');
                    });
                }).catch((error) => {
                    log.log('[editmsg] - ' + message.guild.id + ' : ' + error);
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'max chars:\n title: 1024 \n body: 1024', '#ff0000', 5000);
            }
        }
    }
}

exports.get_reaction = async (guild, channelID, messageID, emoteID) => {
    return db.get_reaction(guild, channelID, messageID, emoteID);
}