//own scripts
const log = require("./log");
const badwords = require("./badwords");
const db = require("./db");
const modulhandler = require("./modulhandler");

let config = '';

exports.handler = async (client, message) => {
    config = (config === '') ? await db.get_config(message.guild) : config;

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
                modulhandler.help(config, client, message);
                break;
            case cf_prefix + 'help':
                modulhandler.help(config, client, message);
                break;
            case cf_prefix + 'channel':
                modulhandler.channel(config, client, message).then(async () => {
                    config = await db.get_config(message.guild);
                });
                break;
        }
        if(cf_channel.toString().match(regexChannel) !== null){
            //if channel is set
            switch(command){
                //REACTION
                case cf_prefix + 'addrole':
                    modulhandler.addrole(config, client, message);
                    break;
                case cf_prefix + 'removerole':
                    modulhandler.removerole(config, client, message);
                    break;
                case cf_prefix + 'reactionid':
                    modulhandler.reactionid(config, client, message);
                    break;
                case cf_prefix + 'embedmsg':
                    modulhandler.embedmsg(config, client, message);
                    break;
                case cf_prefix + 'editmsg':
                    modulhandler.editmsg(config, client, message);
                    break;
            }
        }
    }
}