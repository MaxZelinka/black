//own scripts
const badwords = require("./badwords");
const db = require("./db");
const modhandler = require("./modulhandler");
const msg_send = require("./msg_send");

exports.handler = async (client, message) => {
    if (message.guild !== null) {

        let config = await db.get_config(message.guild);
        //umstruktieren, ansonsten lädt er jedes mal die config, bei jeder msg

        if (config[0] !== undefined) {
            const cf_channel = (config[0].Channel.includes(',')) ? [...config[0].Channel.replace(/[ ]/gm, '').split(',')] : [config[0].Channel.replace(/[ ]/gm, '')];
            const cf_blacklist = (config[0].blacklist.includes(',')) ? [...config[0].blacklist.replace(/[ ]/gm, '').split(',')] : [config[0].blacklist.replace(/[ ]/gm, '')];
            const cf_prefix = config[0].Prefix;

            const args = message.content.trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            const regexPrefix = new RegExp('^(' + cf_prefix.replace(/\?/gm, '\\?') + ')\\S*', 'gm');

            if (cf_blacklist.includes(message.author.id)
                && message.content.match(regexPrefix) !== null) {
                msg_send.embedMessage(client, message.channel.id, 'Blacklist', message.author.toString() + ' - you are blacklistet from using commands.', '#ff0000', 5000);
            } else {
                switch (command) {
                    case '?bfirst':
                        modhandler.first(config, client, message);
                        break;
                    case '?bhelp':
                        modhandler.help(config, client, message);
                        break;
                    case cf_prefix + 'help':
                        modhandler.help(config, client, message);
                        break;
                    case cf_prefix + 'channel':
                        modhandler.channel(config, client, message);
                        break;
                }
                if (cf_channel.includes(message.channel.id)) {
                    //if channel is set
                    switch (command) {
                        //CONFIG
                        case cf_prefix + 'prefix':
                            modhandler.prefix(config, client, message);
                            break;
                        case cf_prefix + 'mod':
                            modhandler.mod(config, client, message);
                            break;
                        case cf_prefix + 'botlog':
                            modhandler.botlog(config, client, message);
                            break;
                        case cf_prefix + 'modlog':
                            modhandler.not(client, message);
                            break;
                        case cf_prefix + 'blacklist':
                            modhandler.not(client, message);
                            break;
                        case cf_prefix + 'automod':
                            modhandler.not(client, message);
                            break;
                        case cf_prefix + 'welcome':
                            modhandler.not(client, message);
                            break;
                        case cf_prefix + 'welcomemsg':
                            modhandler.not(client, message);
                            break;
                        case cf_prefix + 'leaverlog':
                            modhandler.not(client, message);
                            break;
                        //COMMANDS
                        case cf_prefix + 'serverinfo':
                            modhandler.serverinfo(config, message);
                            break;
                        case cf_prefix + 'clear':
                            modhandler.clear(message);
                            break;
                        //MODUL
                        case cf_prefix + 'modul':
                            modhandler.not(client, message);
                            break;
                        //REACTION
                        case cf_prefix + 'addrole':
                            modhandler.addrole(config, client, message);
                            break;
                        case cf_prefix + 'removerole':
                            modhandler.removerole(config, client, message);
                            break;
                        case cf_prefix + 'reactionid':
                            modhandler.reactionid(config, client, message);
                            break;
                        case cf_prefix + 'embedmsg':
                            modhandler.embedmsg(config, client, message);
                            break;
                        case cf_prefix + 'editmsg':
                            modhandler.editmsg(config, client, message);
                            break;
                        //LEAGUEOFLEGENDS
                        case cf_prefix + 'setLOL':
                            modhandler.not(client, message);
                            //modhandler.setlolAcc(config, client, message);
                            break;
                    }
                }
            }
        }
    }

}