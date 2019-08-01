//Checks

exports.isUser = (arg) => {
    return (arg && arg.match(/^<@!?([0-9]{18})>$/gm) !== null) ? true : false;
}

exports.isChannel = (arg) => {
    return (arg && arg.match(/^<#!?([0-9]{18})>$/gm) !== null) ? true : false;   
}

exports.isAdmin = (message) => {
    return message.member.permissions.has('ADMINISTRATOR');
}

exports.isMod = (message, config) => {
    return [...config[0].Moderator].includes(message.author.id);
}

exports.isURL = (arg) => {
    return (arg && arg.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm) !== null) ? true : false;
}

exports.isDigit = (arg) => {
    return (arg && arg.match(/^[0-9]*$/gm) !== null) ? true : false;
}

//Gets

exports.cut_cmd = async (msg) => {
    const args = msg.content.trim().split(/ +/g);
    args.shift();
    return args;
}

exports.get_message = async (client, channel_ID, message_ID) => {
    return client.channels.get(channel_ID).fetchMessage(message_ID);
}

exports.get_channel = async (client, channel_ID) => {
    return client.channels.get(channel_ID);
}

exports.to_colorcode = (color) => {
    return parseInt(color, 16);
}