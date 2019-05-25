const db = require("../db");
const admin = require("../admin");
const msg_send = require("../msg_send");

exports.channel = async (config, client, message) => {
    message.delete();
    const args = message.content.trim().split(/ +/g);
    args.shift();

    let get_channel = await db.get_channel(message.guild);
    get_channel = get_channel.shift();

    if (admin.isAdmin(message) === true || admin.isMod(message, config) === true) {
        if(args[0] !== undefined){
            //set
            if(admin.isChannel(args[0]) == true){
                let set_channel = await db.set_channel(message.guild, get_channel);
                console.log(set_channel);
            } else {
                message.channel.send('argument is\'nt a channel').then((msg) => msg.delete(5000));
            }
        } else {
            //get
            if(get_channel.Channel === null){
                //channels not set
                msg_send.embedMessage(client, message.channel.id, 'Channel', 'not set yet', '000000');
            } else {
                //if channels set
                let channels = get_channel.Channel.split(',');
                if(channels.length > 1){
                    channels = channels.map((el) => {
                        return message.guild.channels.get(el.trim()) + '\n';
                    });
                    msg_send.embedMessage(client, message.channel.id, 'Channel', channels.toString().replace(/,/gm,''), '000000');
                } else {
                    channels = message.guild.channels.get(channels.toString().trim());
                    msg_send.embedMessage(client, message.channel.id, 'Channel', channels.toString(), '000000');
                }
            }
        }
    }
}