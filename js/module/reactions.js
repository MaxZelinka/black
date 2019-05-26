const db = require("../db");
const admin = require("../admin");
const msg_send = require("../msg_send");
const punycode = require('punycode');

exports.addrole = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();
    if (admin.isAdmin(message) === true || admin.isMod(message, config) === true) {
        if (args[0] !== undefined
            && admin.isChannel(args[0]) === true
            && args[1] !== undefined
            && args[2] !== undefined
            && args[3] !== undefined) {
            let channelID = args[0].replace(/[<#>]/gm, '');
            let messageID = args[1];
            let emoteID = (args[2].match(/[<>]/gm) !== null) ? args[2].replace(/^<:|>/gm, '') : punycode.ucs2.decode(args[2]);
            let roleID = args[3].replace(/[<@&>]/gm, '');

            admin.get_message(client, channelID, messageID).then((found) => {
                db.set_reaction(message.guild, channelID, messageID, emoteID, roleID).then((reaction_ID) => {
                    if(reaction_ID !== undefined){
                        let reaction = (args[2].match(/[<>]/gm) !== null) ? args[2].replace(/^<:|>/gm, '') : args[2];
                        found.react(reaction);

                        msg_send.embedMessage(client, message.channel.id, 'Reaction', 'Reaction_ID: ' + reaction_ID[0].reactionsID, '000000');
                    } else {
                        message.channel.send('cant create reaction. Double Entry?').then((msg) => msg.delete(5000));
                    }
                }).catch((error) => {
                    message.channel.send('cant create reaction.').then((msg) => msg.delete(5000));
                });
            }).catch((error) => {
                message.channel.send('wrong channel_ID/message_ID').then((msg) => msg.delete(5000));
            });


        } else {
            message.channel.send('missing arguments.').then((msg) => msg.delete(5000));
        }
    }
}

exports.removerole = async (config, client, message) => {

}

exports.reactionid = async (config, client, message) => {

}

exports.embedmsg = async (config, client, message) => {

}

exports.editmsg = async (config, client, message) => {

}

exports.get_reaction = async (guild, channelID, messageID, emoteID) => {
    return db.get_reaction(guild, channelID, messageID, emoteID);
}