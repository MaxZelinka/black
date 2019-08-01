//check
exports.isUser = (arg) => (arg && arg.match(/^<@!?([0-9]{18})>$/gm) !== null);
exports.isChannel = (arg) => (arg && arg.match(/^<#!?([0-9]{18})>$/gm) !== null);   
exports.isAdmin = (message) => message.member.permissions.has('ADMINISTRATOR');
exports.isMod = (message, config) =>  [...config[0].Moderator].includes(message.author.id);
exports.isURL = (arg) => (arg && arg.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm) !== null);
exports.isDigit = (arg) => (arg && arg.match(/^[0-9]*$/gm) !== null);

//get
exports.get_message = (client, channel_ID, message_ID) => client.channels.get(channel_ID).fetchMessage(message_ID);
exports.get_channel = (client, channel_ID) => client.channels.get(channel_ID);

//convert
exports.to_colorcode = (color) => parseInt(color, 16);
exports.cut_cmd = (msg) => {
    const args = msg.content.trim().split(/ +/g);
    args.shift();
    return args;
}