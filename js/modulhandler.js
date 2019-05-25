//own scripts
const help = require("./module/help");
const channel = require("./module/channel");

exports.first = async (config, client) => {

}

exports.help = async (config, client, message) => {
    help.help(config, client, message);
}

exports.channel = async (config, client, message) => {
    channel.channel(config, client, message);
}