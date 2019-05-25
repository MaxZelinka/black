//own scripts
const help = require("./module/help");
const channel = require("./module/channel");

exports.first = async function(config, client){

}

exports.help = async function(config, client, message){
    help.help(config, client, message);
}

exports.channel = async function(config, client, message){
    channel.channel(config, client, message);
}