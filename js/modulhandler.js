//own scripts
const msg_send = require("./msg_send");

const help = require("./module/help");
const reactions = require("./module/reactions");
const cfg = require("./module/config");

/*
modulare bauweise

const controller      = require('require-all')(__dirname + '/module/');

const keys = Object.entries(controller).filter(val => {
    if(Object.keys(val[1]).includes('cfg') == true){
      return val[0];
    } else {
      console.log('module ' + val[0] + ' is missing cfg function.');
    }
  });

  let cfg = keys.map(el => {
    return eval('controller.' + el[0] + '.cfg')();
  });
*/

exports.not = (client, message) => {
    msg_send.embedMessage(client, message.channel.id, 'Command', 'function currently disabled', '#ff0000', 5000);
}

exports.first = async (config, client, message) => {
    help.first(config, client, message);
}

exports.help = async (config, client, message) => {
    help.help(config, client, message);
}

//CONFIG

exports.prefix = async (config, client, message) => {
    cfg.prefix(config, client, message);
}

exports.channel = async (config, client, message) => {
    cfg.channel(config, client, message);
}

exports.mod = async (config, client, message) => {
    cfg.mod(config, client, message);
}

exports.botlog = async (config, client, message) => {
    cfg.botlog(config, client, message);
}

//REACTION
exports.addrole = async (config, client, message) => {
    reactions.addrole(config, client, message);
}

exports.removerole = async (config, client, message) => {
    reactions.removerole(config, client, message);
}

exports.reactionid = async (config, client, message) => {
    reactions.reactionid(config, client, message);
}

exports.embedmsg = async (config, client, message) => {
    reactions.embedmsg(config, client, message);
}

exports.editmsg = async (config, client, message) => {
    reactions.editmsg(config, client, message);
}

exports.get_reaction = async (guild, channelID, messageID, emoteID) => {
    return reactions.get_reaction(guild, channelID, messageID, emoteID);
}