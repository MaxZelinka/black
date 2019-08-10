//own scripts
const db = require("./db"),
    msg_send = require("./msg_send"),
    help = require("./module/help"),
    reactions = require("./module/reactions"),
    cfg = require("./module/config"),
    lol = require("./module/leagueoflegends"),
    cmd = require("./module/commands");

function not(client, message) {
    msg_send.embedMessage(client, message.channel.id, 'Command', 'function currently disabled', '#ff0000', 5000);
}

exports.handler = async (discord, client, modules, cache, message) => {
    if (message.guild !== null) {
        db.get_config(message.guild).then(async (config) => {
            if (config && config[0]) {
                const cf_channel = (config[0].Channel) ? (config[0].Channel.includes(',')) ? [...config[0].Channel.replace(/[ ]/gm, '').split(',')] : [config[0].Channel.replace(/[ ]/gm, '')] : '',
                    cf_blacklist = (config[0].blacklist) ? (config[0].blacklist.includes(',')) ? [...config[0].blacklist.replace(/[ ]/gm, '').split(',')] : [config[0].blacklist.replace(/[ ]/gm, '')] : '',
                    cf_prefix = config[0].Prefix;

                let blacklist = (cache.blacklist.get(message.guild.id)) || await modules.db.query(`SELECT user_id FROM blacklist WHERE server_id = ${message.guild.id}`)
                    .catch(err => modules.msgsend.error(client, message, message.channel.id, 'Blacklist', err));
                blacklist = blacklist.map(el => el.user_id);

                if(blacklist.includes(message.author.id)){
                    console.log('test');
                }

                const args = message.content.trim().split(/ +/g);
                const command = args.shift().toLowerCase();

                const regexPrefix = new RegExp('^(' + cf_prefix.replace(/\?/gm, '\\?') + ')\\S*', 'gm');

                if (cf_blacklist.includes(message.author.id) && message.content.match(regexPrefix)) {
                    msg_send.embedMessage(client, message.channel.id, 'Blacklist', message.author.toString() + ' - you are blacklistet from using commands.', '#ff0000', 5000);
                } else {
                    switch (command) {
                        case '?bfirst':
                            help.first(config, client, message);
                            break;
                        case '?bhelp':
                            help.help(config, client, message);
                            break;
                        case cf_prefix + 'help':
                            help.help(config, client, message);
                            break;
                        case cf_prefix + 'channel':
                            cfg.channel(config, client, message);
                            break;
                    }
                    if (cf_channel.includes(message.channel.id)) {
                        //if channel is set
                        switch (command) {
                            //CONFIG
                            case cf_prefix + 'prefix':
                                cfg.prefix(config, client, message);
                                break;
                            case cf_prefix + 'mod':
                                cfg.mod(config, client, message);
                                break;
                            case cf_prefix + 'botlog':
                                cfg.botlog(config, client, message);
                                break;
                            case cf_prefix + 'modlog':
                                cfg.modlog(config, client, message);
                                break;
                            case cf_prefix + 'blacklist':
                                cfg.blacklist(config, client, modules, cache, message);
                                break;
                            case cf_prefix + 'automod':
                                not(client, message);
                                break;
                            case cf_prefix + 'welcome':
                                modules.cfg.welcome(config, client, modules, cache, message);
                                break;
                            case cf_prefix + 'welcomemsg':
                                not(client, message);
                                break;
                            case cf_prefix + 'leaverlog':
                                not(client, message);
                                break;

                                //COMMANDS
                            case cf_prefix + 'serverinfo':
                                cmd.serverinfo(config, message);
                                break;
                            case cf_prefix + 'clear':
                                cmd.clear(client, message);
                                break;
                            case cf_prefix + 'img':
                                cmd.img(config, client, message);
                                break;
                            case cf_prefix + 'embedimg':
                                cmd.embedimg(config, client, message);
                                break;
                            case cf_prefix + 'del':
                                cmd.del(client, message);
                                break;
                            case cf_prefix + 'undel':
                                cmd.undel(client, message);
                                break;

                                //MODUL
                            case cf_prefix + 'modul':
                                not(client, message);
                                break;

                                //REACTION
                            case cf_prefix + 'addrole':
                                reactions.addrole(config, client, message);
                                break;
                            case cf_prefix + 'removerole':
                                reactions.removerole(config, client, message);
                                break;
                            case cf_prefix + 'reactionid':
                                reactions.reactionid(config, client, message);
                                break;
                            case cf_prefix + 'embedmsg':
                                reactions.embedmsg(config, client, message);
                                break;
                            case cf_prefix + 'editmsg':
                                reactions.editmsg(config, client, message);
                                break;

                                //LEAGUEOFLEGENDS
                            case cf_prefix + 'getlol':
                                lol.get_lol(config, client, message);
                                break;
                            case cf_prefix + 'setlol':
                                lol.set_lol(config, client, message);
                                break;
                        }
                    }
                }
            }
        })
    }
}