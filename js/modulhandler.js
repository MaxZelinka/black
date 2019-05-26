//own scripts
const help = require("./module/help");
const channel = require("./module/channel");
const reactions = require("./module/reactions")

exports.first = async (config, client) => {

}

exports.help = async (config, client, message) => {
    help.help(config, client, message);
}

exports.channel = async (config, client, message) => {
    channel.channel(config, client, message);
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