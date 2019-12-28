const log = require('./log');

(function init() {
    
}());

let events = {
    channelCreate: [],
    channelDelete: [],
    channelPinsUpdate: [],
    channelUpdate: [],
    clientUserGuildSettingsUpdate: [],
    clientUserSettingsUpdate: [],
    debug: [],
    disconnect: [],
    emojiCreate: [],
    emojiDelete: [],
    emojiUpdate: [],
    error: [],
    guildBanAdd: [],
    guildBanRemove: [],
    guildCreate: [],
    guildDelete: [],
    guildIntegrationsUpdate: [],
    guildMemberAdd: [],
    guildMemberAvailable: [],
    guildMemberRemove: [],
    guildMembersChunk: [],
    guildMemberSpeaking: [],
    guildMemberUpdate: [],
    guildUnavailable: [],
    guildUpdate: [],
    message: [],
    messageDelete: [],
    messageDeleteBulk: [],
    messageReactionAdd: [],
    messageReactionRemove: [],
    messageReactionRemoveAll: [],
    messageUpdate: [],
    presenceUpdate: [],
    rateLimit: [],
    ready: [],
    reconnecting: [],
    resume: [],
    roleCreate: [],
    roleDelete: [],
    roleUpdate: [],
    typingStart: [],
    typingStop: [],
    userNoteUpdate: [],
    userUpdate: [],
    voiceStateUpdate: [],
    warn: [],
    webhookUpdate: []
}

exports.add_event = (event, modul, func) => {
    events[event].push({
        [modul]: [func]
    });
}

exports.call = (bot_module, event, client, args) => {
    events[event].map(modul => {
        try {
            bot_module[Object.keys(modul)][Object.values(modul)](client, args);
        } catch (err) {
            log.log(err);
        }
    });
}