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
    const cf_mods = (config[0].Moderator !== null) ? config[0].Moderator : '';
    const regexMod = new RegExp(message.author.id, 'g');
    return (cf_mods.toString().match(regexMod) !== null) ? true : false;
}

exports.hasPerm = (func, message) => {
    //function for the right_system
    return false;
}

exports.get_message = async (client, channel_ID, message_ID) => {
    return client.channels.get(channel_ID).fetchMessage(message_ID);
}

exports.to_colorcode = (color) => {
    return parseInt(color.replace('#', ''), 16);
}