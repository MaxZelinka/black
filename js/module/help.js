const msg_send = require("../msg_send");

exports.first = (config, client, message) => {
    message.delete();
    const first = `Welcome to your new Bot!
    Here are a few tips to make sure the bot works properly.

    Everything below is admin only.

    **1) Role**
    Discord itself assigns bot roles. Make sure the bot role is above all the other roles.
    Used for e.g. Reaction Roles. The bot can not assign roles about which first itself does not have the rights.
    It would be awesome if the bot stay black (color)! :)

    **2) Channel**
    Use \`` + config[0].Prefix + `channel\` to setup the channel where every user use commands.

    **3) Premium**
    If you want to use every feature, make sure to be an patreon (link).
    To activate your premium feature, use \`` + config[0].Prefix + `premium [key]\`.

    **4) Updates**
    With \`` + config[0].Prefix + `update\` you can setup the channel for upcomming updates and their release date.

    **Thanks for using the bot!** - Necromant#0916
    `; 

    msg_send.embedMessage(client, message.channel.id, 'First', 'Inbox!', '000000');
    message.author.send(first);
}

exports.help = (config, client, message) => {
    message.delete();
    const help = new Array();

    help['settings'] = `To run a command in ` + message.guild.name + `, use ` + config[0].Prefix + ` + command. For example, \`` + config[0].Prefix + `help\`. \n
__**Commands**__\n
**first**: first steps to config this server!

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

    msg_send.embedMessage(client, message.channel.id, 'Help', 'Inbox!', '000000');

    message.author.send(help['settings']).then(() => {
        message.author.send(help['modul']).then(() => {
            message.author.send(help['reaction']);
        });
    });
}