exports.help = async function(config, client, message){
    message.delete();
    const help = new Array();

    help['settings'] = `To run a command in ` + message.guild.name + `, use ` + config[0].Prefix + ` + command. For example, \`` + config[0].Prefix + `help\`. \n
__**Commands**__\n
**first**: first steps if you are new!

__Settings__
**prefix**: get/set prefix
**channel**: show | add/remove bot-channel
**mod**: show | add/remove bot-mod
**botlog**: show | add/remove botlog-channel
**modlog**: show | add/remove modlog-channel
**blacklist**: show | add/remove blacklist-user
**automod**: show | add/remove automod-channel
**welcome**: show | set welcome-channel
**welcomemsg**: show | set welcome-message
**leaverlog**: show | set leaverlog-channel
**help**: to get this

__Modules__`;

help['modul'] = `
To activate/deactivate an modul, use ` + config[0].Prefix + `modul [modulname][on/off]. For example, \`` + config[0].Prefix + `modul automod on\`. \n 
Avialeble Modules: 
**welcome**: welcome-system
**leaver**: leaverlog
**automod**: 'badwords'-filter
**link**: link-filter
**invite**: invite-links-filter
**mention**: massmention-filter
**spam**: spam-filter

__Reaction Role__`;

        help['reaction'] = `
**addrole** [channel] [messageID] [emote] [role]: add Reaction Role
**removerole** [reactionID]: remove Reaction Role
**reactionid** : show all currently used reactionIDs
**embedmsg** [channel] "[title]" "[body]": create an embedmessage
**editmsg** [channel] [messageID] title/body "[value]": change embedmessage value
`;

client.channels.get(message.channel.id).send(help['settings']).then(() => {
    client.channels.get(message.channel.id).send(help['modul']).then(() => {
        client.channels.get(message.channel.id).send(help['reaction']);
    });
});
}