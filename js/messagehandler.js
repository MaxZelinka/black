//own scripts
const badwords = require("./badwords");
const db = require("./db");
const modhandler = require("./modulhandler");
const msg_send = require("./msg_send");

let config = '';

exports.handler = async (client, message) => {
    if (message.guild !== null) {
        config = (config === '') ? await db.get_config(message.guild) : await config;
        
        if(config[0] !== undefined){

            //console.log(); //.replace(' ','')

            const cf_channel = (config[0].Channel !== null) ? config[0].Channel : '';
            const cf_blacklist = (config[0].blacklist !== null) ? config[0].blacklist : '';
            const cf_prefix = config[0].Prefix;
    
            const args = message.content.trim().split(/ +/g);
            const command = args.shift().toLowerCase();
    
            const regexBlacklist = new RegExp(message.author.id, 'gm');
            const regexPrefix = new RegExp('^(' + cf_prefix.replace(/\?/gm, '\\?') + ')\\S*', 'gm');
            const regexChannel = new RegExp(message.channel.id, 'g');
    
            if (cf_blacklist.toString().match(regexBlacklist) !== null
                && message.content.match(regexPrefix) !== null) {
                //if user is blacklistet & trying to use an command
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
                        modhandler.channel(config, client, message).then(() => {
                            config = db.get_config(message.guild);
                        });
                        break;
                }
                if (cf_channel.toString().match(regexChannel) !== null) {
                    //if channel is set
                    switch (command) {
                        //CONFIG
                        case cf_prefix + 'prefix':
                            modhandler.prefix(config, client, message).then(() => {
                                config = db.get_config(message.guild);
                            });
                            break;
                        case cf_prefix + 'mod':
                            modhandler.mod(config, client, message).then(() => {
                                config = db.get_config(message.guild);
                            });
                            break;
                        case cf_prefix + 'botlog':
                            modhandler.not();
                            break;
                        case cf_prefix + 'modlog':
                            modhandler.not();
                            break;
                        case cf_prefix + 'blacklist':
                            modhandler.not();
                            break;
                        case cf_prefix + 'automod':
                            modhandler.not();
                            break;
                        case cf_prefix + 'welcome':
                            modhandler.not();
                            break;
                        case cf_prefix + 'welcomemsg':
                            modhandler.not();
                            break;
                        case cf_prefix + 'leaverlog':
                            modhandler.not();
                            break;
                        //MODUL
                        case cf_prefix + 'modul':
                            modhandler.not();
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
                    }
                }
            }
        }
    }

}