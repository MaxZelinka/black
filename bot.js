var start = new Date();

const discord = require("discord.js"),
  client = new discord.Client({ autoReconnect: true }),
  auth = require("./config/auth.json");

  const modul = require('./modul');
  const event = require('./event');
  const message = require('./message');
  const database = require('./database');
  const log = require('./log');
  const service = require('./service');
  const moment = require('moment');

const modules = {
  /*extern*/
  punycode: require('punycode'),
  NodeCache: require('node-cache'),
  fspromise: require('fs.promises'),
  moment: require('moment'),
  request: require("request"),
  fs: require("fs"),
  naturalCompare: require("natural-compare"),
  cron: require('node-cron'),
  path: require('path'),

  /*intern*/
  admin: require('./js/admin'),
  db: require('./js/db'),
  log: require('./js/log'),
  msghandler: require('./js/messagehandler'),
  msgsend: require('./js/msg_send'),
  services: require('./js/services'),
  cmd: require("./js/module/commands"),
  cfg: require("./js/module/config"),
  help: require("./js/help"),
  lol: require("./js/leagueoflegends"),
  reactions: require("./js/reactions"),
  file: require("./js/file"),
  bday: require("./js/bday"),
}


const cache = {
  blacklist: new modules.NodeCache(),
}

const db = require("./js/db"),
  reactions = require("./js/reactions");

/**************************************************************************************************************/
/* BOT STARTS                                                                                                 */
/**************************************************************************************************************/
client.on('ready', async  (ready) => {
  // console.log('[bot started]');
  modules.services.set_status(client, modules);

  var time = new Date() - start;
  console.log('------------------------------------------');
  console.log('[bot started] used time: ' + time/1000 + 's');
  event.call(modul.get_module(), 'ready', ready);

  modules.services.start(client, modules);
});

/**************************************************************************************************************/
/* ERROR HANDLING                                                                                             */
/**************************************************************************************************************/
//Emitted whenever the client's WebSocket encounters a connection error.
client.on('error', error => {
  console.log(error);
  client.guilds.get('312477482836295681').channels.get('562208160329498624').send('[error] - restart')
    .then(() => client.destroy())
    .then(() => client.login(auth.token));
});
//Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
client.on('disconnect', disconnect => console.log(disconnect));
//Emitted whenever the client tries to reconnect to the WebSocket.
client.on('reconnecting', reconnecting => console.log('[reconnecting]'));
//Emitted for general warnings.
client.on('warn', warn => console.log(warn));

/**************************************************************************************************************/
/* GUILD                                                                                                      */
/**************************************************************************************************************/
//Emitted whenever the client joins a guild.
client.on('guildCreate', async guild => {
  //Whether the guild is available to access. If it is not available, it indicates a server outage 
  if (guild.available) {
    modules.db.get_config(guild).then(config => {
      if (!config || config.length == 0) {
        modules.db.set_config(guild);
      } else {
        modules.db.set_guildactive(guild, 1);
      }
    })
  }
});
//Emitted whenever a guild is deleted/left.
client.on('guildDelete', async guild => modules.db.set_guildactive(guild, 0));

/**************************************************************************************************************/
/* MEMBER                                                                                                     */
/**************************************************************************************************************/
//Emitted whenever a user joins a guild.
client.on('guildMemberAdd', async member => {
  db.get_config(member.guild).then((config) => {
    if (config && config.length > 0) {
      if (config[0].welcome === 1 && config[0].welcome_channel && config[0].botlog) {

        const chn = member.guild.channels.get(config[0].welcome_channel),
          server_icon = (member.guild.iconURL !== null) ? member.guild.iconURL : '';
        if (!member.user.bot) {
          const welcomemsg = new discord.RichEmbed()
            .setColor('#000000')
            .setAuthor('Welcome', server_icon)
            .setDescription(member.user.toString() + ' Welcome to the LPGG-Discord, enjoy your stay!')
            .setImage('https://steamuserimages-a.akamaihd.net/ugc/845963567852349042/400307109ECE5B0975C57845FFFB2B5C023A3841/');
          chn.send(welcomemsg);
        } else {
          const welcomemsg = new discord.RichEmbed()
            .setColor('#000000')
            .setDescription(member.user.toString() + ' (bot) joined');
          chn.send(welcomemsg);
        }
      }
    }
  }).catch((error) => {
    modules.log.log_(modules, '[guildMemberAdd] - ' + member.guild.id + ' : ' + error);
  });
});

//Emitted whenever a member leaves a guild, or is kicked.
client.on('guildMemberRemove', async member => {
  db.get_config(member.guild).then((config) => {
    if (config !== undefined && config.length >= 0) {
      if (config[0].leaver === 1 && config[0].leaver_channel !== null) {
        member.guild.channels.get(config[0].leaver_channel).send(member.user.toString() + ' left the Server.');
      }
    }
  }).catch((error) => {
    modules.log.log_(modules, '[guildMemberRemove] - ' + member.guild.id + ' : ' + error);
  });
});

/**************************************************************************************************************/
/* REACTIONS                                                                                                  */
/**************************************************************************************************************/

const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

//https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
//handle raw events (for e.g. uncached messages)
client.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;
  const {
    d: data
  } = event;
  const user = client.users.get(data.user_id),
    channel = client.channels.get(data.channel_id) || await user.createDM();

  //if (channel.messages.has(data.message_id)) return; //event trigger 2 times without this

  const message = await channel.fetchMessage(data.message_id),
    emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    // Create an object that can be passed through the event like normal
    const emoji = new discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
    reaction = new discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
  }
  client.emit(events[event.t], reaction, user, message);
});

//Emitted whenever a reaction is added to a cached message.
client.on('messageReactionAdd', async (reaction, user, message) => {
  if (reaction.me && message && !user.bot) {
    const channelID = message.channel.id,
      messageID = message.id,
      emoteID = modules.punycode.encode((reaction.emoji.id !== null) ? '<:' + reaction.emoji.name + ':' + reaction.emoji.id + '>' : reaction.emoji.name);

    const response = await reactions.get_reaction(message.guild, channelID, messageID, emoteID);

    if (response && response.length > 0) {
      message.guild.members.get(user.id).addRole(response[0].RoleID).catch((error) => {
        console.log(error);
      });
    }
  }
});

//Emitted whenever a reaction is removed from a cached message.
client.on('messageReactionRemove', async (reaction, user, message) => {
  if (reaction.me && message && !user.bot) {
    const channelID = message.channel.id,
      messageID = message.id,
      emoteID = modules.punycode.encode((reaction.emoji.id !== null) ? '<:' + reaction.emoji.name + ':' + reaction.emoji.id + '>' : reaction.emoji.name),
      response = await reactions.get_reaction(message.guild, channelID, messageID, emoteID);

    if (response && response.length > 0) {
      message.guild.members.get(user.id).removeRole(response[0].RoleID).catch((error) => {
        console.log(error);
      });
    }
  }
});

/**************************************************************************************************************/
/* MESSAGES                                                                                                   */
/**************************************************************************************************************/

//Emitted whenever a message is created.
client.on("message", async message => {
  modules.msghandler.handler(discord, client, modules, cache, message);

});

client.on('channelCreate', data => event.call(modul.get_module(), 'channelCreate', client, data));
client.on('channelDelete', data => event.call(modul.get_module(), 'channelDelete', client, data));
client.on('channelPinsUpdate', data => event.call(modul.get_module(), 'channelPinsUpdate', client, data));
client.on('channelUpdate', data => event.call(modul.get_module(), 'channelUpdate', client, data));
client.on('clientUserGuildSettingsUpdate', data => event.call(modul.get_module(), 'clientUserGuildSettingsUpdate', client, data));
client.on('clientUserSettingsUpdate', data => event.call(modul.get_module(), 'clientUserSettingsUpdate', client, data));
client.on('debug', data => event.call(modul.get_module(), 'debug', client, data));
client.on('disconnect', data => event.call(modul.get_module(), 'disconnect', client, data));
client.on('emojiCreate', data => event.call(modul.get_module(), 'emojiCreate', client, data));
client.on('emojiDelete', data => event.call(modul.get_module(), 'emojiDelete', client, data));
client.on('emojiUpdate', data => event.call(modul.get_module(), 'emojiUpdate', client, data));
client.on('error', data => event.call(modul.get_module(), 'error', client, data));
client.on('guildBanAdd', data => event.call(modul.get_module(), 'guildBanAdd', client, data));
client.on('guildBanRemove', data => event.call(modul.get_module(), 'guildBanRemove', client, data));
client.on('guildCreate', data => event.call(modul.get_module(), 'guildCreate', client, data));
client.on('guildDelete', data => event.call(modul.get_module(), 'guildDelete', client, data));
client.on('guildIntegrationsUpdate', data => event.call(modul.get_module(), 'guildIntegrationsUpdate', client, data));
client.on('guildMemberAdd', data => event.call(modul.get_module(), 'guildMemberAdd', client, data));
client.on('guildMemberAvailable', data => event.call(modul.get_module(), 'guildMemberAvailable', client, data));
client.on('guildMemberRemove', data => event.call(modul.get_module(), 'guildMemberRemove', client, data));
client.on('guildMembersChunk', data => event.call(modul.get_module(), 'guildMembersChunk', client, data));
client.on('guildMemberSpeaking', data => event.call(modul.get_module(), 'guildMemberSpeaking', client, data));
client.on('guildMemberUpdate', data => event.call(modul.get_module(), 'guildMemberUpdate', client, data));
client.on('guildUnavailable', data => event.call(modul.get_module(), 'guildUnavailable', client, data));
client.on('guildUpdate', data => event.call(modul.get_module(), 'guildUpdate', client, data));
client.on('message', data => event.call(modul.get_module(), 'message', client, data));
client.on('messageDelete', data => event.call(modul.get_module(), 'messageDelete', client, data));
client.on('messageDeleteBulk', data => event.call(modul.get_module(), 'messageDeleteBulk', client, data));
client.on('messageReactionAdd', data => event.call(modul.get_module(), 'messageReactionAdd', client, data));
client.on('messageReactionRemove', data => event.call(modul.get_module(), 'messageReactionRemove', client, data));
client.on('messageReactionRemoveAll', data => event.call(modul.get_module(), 'messageReactionRemoveAll', client, data));
client.on('messageUpdate', data => event.call(modul.get_module(), 'messageUpdate', client, data));
client.on('presenceUpdate', data => event.call(modul.get_module(), 'presenceUpdate', client, data));
client.on('rateLimit', data => event.call(modul.get_module(), 'rateLimit', client, data));
client.on('reconnecting', data => event.call(modul.get_module(), 'reconnecting', client, data));
client.on('resume', data => event.call(modul.get_module(), 'resume', client, data));
client.on('roleCreate', data => event.call(modul.get_module(), 'roleCreate', client, data));
client.on('roleDelete', data => event.call(modul.get_module(), 'roleDelete', client, data));
client.on('roleUpdate', data => event.call(modul.get_module(), 'roleUpdate', client, data));
client.on('typingStart', data => event.call(modul.get_module(), 'typingStart', client, data));
client.on('typingStop', data => event.call(modul.get_module(), 'typingStop', client, data));
client.on('userNoteUpdate', data => event.call(modul.get_module(), 'userNoteUpdate', client, data));
client.on('userUpdate', data => event.call(modul.get_module(), 'userUpdate', client, data));
client.on('voiceStateUpdate', data => event.call(modul.get_module(), 'voiceStateUpdate', client, data));
client.on('warn', data => event.call(modul.get_module(), 'warn', client, data));
client.on('webhookUpdate', data => event.call(modul.get_module(), 'webhookUpdate', client, data));

client.login(auth.token);