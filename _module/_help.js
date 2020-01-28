const discord = require("discord.js");
const event = require('../event');

(function init() {
    event.add_event('message', '_help', 'call');
}());

var arr_help = []; //array of objects {name: -modul-, perm: -permissions-, commands: [commandlist: description]}

exports.add_help = (obj) => {
    arr_help.push(obj);
}

exports.call = (client, args) => {
    const argument = args.content.trim().split(/ +/g)
    const command = argument.shift().toLowerCase();

    if (command == '?bhelp') {
        if (arr_help.length) {

            //read array, send it


        } else {
            const embed = new discord.RichEmbed()
                .setColor('000000')
                .setTitle('Help')
                .setDescription('empty :(');

            client.guilds.get(args.guild.id).channels.get(args.channel.id).send({
                embed
            }).then(msg => msg.delete(5000));
        }
    }
}