exports.isUser = (arg) => {
    return (arg !== undefined && arg.match(/^<@!?([0-9]{18})>$/gm) !== null) ? true : false;
}

exports.isChannel = (arg) => {
    return (arg !== undefined && arg.match(/^<#!?([0-9]{18})>$/gm) !== null) ? true : false;   
}

exports.isAdmin = (message) => {
    return message.member.permissions.has('ADMINISTRATOR');
}

exports.isMod = (message, config) => {
    return [...config[0].Moderator].includes(message.author.id);
}

exports.hasPerm = (func, message) => {
    //function for the right_system
    return false;
}

//isURL

exports.get_message = async (client, channel_ID, message_ID) => {
    return client.channels.get(channel_ID).fetchMessage(message_ID);
}

exports.get_channel = async (client, channel_ID) => {
    return client.channels.get(channel_ID);
}

exports.to_colorcode = (color) => {
    return parseInt(color, 16);
}