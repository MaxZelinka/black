const punycode = require('punycode');

//own scripts
const db = require("../db");
const log = require("../log");
const admin = require("../admin");
const msg_send = require("../msg_send");

exports.addrole = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();
    if (admin.isAdmin(message) === true || admin.isMod(message, config) === true) {
        if (args[0] !== undefined &&
            admin.isChannel(args[0]) === true &&
            args[1] !== undefined &&
            args[2] !== undefined &&
            args[3] !== undefined) {
            let channelID = args[0].replace(/[<#>]/gm, '');
            let messageID = args[1];
            let emoteID = (args[2].match(/[<>]/gm) !== null) ? args[2].replace(/^<:|>/gm, '') : punycode.ucs2.decode(args[2]);
            let roleID = args[3].replace(/[<@&>]/gm, '');

            admin.get_message(client, channelID, messageID).then((found) => {
                db.set_reaction(message.guild, channelID, messageID, emoteID, roleID).then((reaction_ID) => {
                    if (reaction_ID !== undefined) {
                        let reaction = (args[2].match(/[<>]/gm) !== null) ? args[2].replace(/^<:|>/gm, '') : args[2];
                        found.react(reaction);

                        msg_send.embedMessage(client, message.channel.id, 'Reaction', 'Reaction_ID: ' + reaction_ID[0].reactionsID, '000000');
                    } else {
                        msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant create reaction. Double Entry?', '#ff0000', 5000);
                    }
                }).catch((error) => {
                    msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant create reaction.', '#ff0000', 5000);
                });
            }).catch((error) => {
                msg_send.embedMessage(client, message.channel.id, 'Reaction', 'wrong channel-ID or message-ID.', '#ff0000', 5000);
            });
        } else {
            msg_send.embedMessage(client, message.channel.id, 'Reaction', 'missing arguments.', '#ff0000', 5000);
        }
    }
}

exports.removerole = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();
    if (admin.isAdmin(message) === true || admin.isMod(message, config) === true) {
        if (args[0] !== undefined) {
            db.remove_reaction(message.guild, args[0]).then(response => {
                if (response !== undefined) {
                    msg_send.embedMessage(client, message.channel.id, 'Reaction', 'reaction deleted.', '#000000');
                }
            });
        } else {
            msg_send.embedMessage(client, message.channel.id, 'Reaction', 'missing arguments.', '#ff0000', 5000);
        }
    }
}

exports.reactionid = async (config, client, message) => {
    if (admin.isAdmin(message) === true || admin.isMod(message, config) === true) {
        db.get_allreaction(message.guild).then(response => {
            if (response !== undefined) {

                let ReactionsEmbed = new Discord.RichEmbed()
                    .setColor('#000000')
                    .setTitle('Reaction IDs')
                    .setDescription('\u200b');

                let count = 0;
                let rest = response.length;

                response.map(el => {
                    count++;
                    rest = rest - 25;
                    let link = 'https://discordapp.com/channels/' + message.guild.id + '/' + el.ChannelID + '/' + el.MessageID;
                    ReactionsEmbed.addField(el.reactionsID + ' - ' +
                        message.guild.channels.get(el.ChannelID).toString() + ' - ' +
                        message.guild.roles.get(el.RoleID).toString() + ' - ' +
                        el.EmoteID, link);

                    if (count == 25 || rest < 10) {
                        client.channels.get(channel_id).send(ReactionsEmbed);
                        ReactionsEmbed = new Discord.RichEmbed()
                            .setColor('#000000')
                            .setTitle('Reaction IDs')
                            .setDescription('\u200b');
                        count = 0;
                    }
                });
            } else {
                msg_send.embedMessage(client, message.channel.id, 'Reaction', 'cant read reaction.', '#ff0000', 5000);
            }
        });
    }
}

exports.embedmsg = async (config, client, message) => {
    message.delete();
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
            let channel = args[0].replace(/[<#!>]/gmi, '');
            let colorcode = admin.to_colorcode(args[1]);

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
            msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'missing arguments.', '#ff0000', 5000);
        }
    }
}

exports.editmsg = async (config, client, message) => {
    message.delete();
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
                    msg_send.embedMessage(client, message.channel.id, 'Embed Message', 'edited.\n' + link, 000);
                });
            }).catch((error) => {
                log.log('[editmsg] - ' + message.guild.id + ' : ' + error);
            });
        }
    }
}

exports.get_reaction = async (guild, channelID, messageID, emoteID) => {
    return db.get_reaction(guild, channelID, messageID, emoteID);
}