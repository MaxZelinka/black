//own scripts
const log = require("./log");
const badwords = require("./badwords");
const db = require("./db");
const modhandler = require("./modulhandler");

let config = '';

exports.handler = async (client, message) => {
    if(message.guild !== null) {
        config = (config === '') ? await db.get_config(message.guild) : config;

        if(config !== undefined){
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
                message.channel.send(message.author.toString() + ' - your are blacklistet from using commands.').then((msg) => msg.delete(5000));
            } else {
                switch(command){
                    case '?bfirst':
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
                if(cf_channel.toString().match(regexChannel) !== null){
                    //if channel is set
                    switch(command){
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