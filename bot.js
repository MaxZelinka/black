const Discord = require("discord.js"),
  client = new Discord.Client(),
  auth = require("./auth.json"),
  fs = require('fs'),
  punycode = require('punycode');

//https://www.npmjs.com/package/node-cache
//https://www.npmjs.com/package/punycode

//own scripts
const log = require("./js/log"),
  services = require("./js/services"),
  db = require("./js/db"),
  msghandler = require("./js/messagehandler"),
  modhandler = require("./js/modulhandler"),
  reactions = require("./module/reactions");

//Bot-Settings
let arr_badwords = [];

/*
Patreon Page
*/

//Events
/**************************************************************************************************************/
/* BOT STARTS                                                                                                 */
/**************************************************************************************************************/
client.on('ready', async () => {
  //log.log('[ready] - bot start');
  console.log('ready');
  services.set_status();
});
/**************************************************************************************************************/
/* ERROR HANDLING                                                                                             */
/**************************************************************************************************************/

//Emitted whenever the client's WebSocket encounters a connection error.
client.on('error', error => {
  log.log('[error]');
  console.log(error);
});

//Emitted when the client hits a rate limit while making a request
client.on('rateLimit', rateLimit => {
  //log.log('[rateLimit] - ' + rateLimit);
  //console.log('[rateLimit]');
});

//Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
client.on('disconnect', disconnect => {
  log.log('[disconnect]');
  console.log(disconnect);
});

//Emitted whenever the client tries to reconnect to the WebSocket.
client.on('reconnecting', reconnecting => {
  //log.log('[reconnecting] - ' + reconnecting);
  console.log('[reconnecting]');
});

//Emitted for general warnings.
client.on('warn', warn => {
  log.log('[warn]');
  console.log(warn);
});

//Emitted whenever a guild text channel has its webhooks changed.
client.on('webhookUpdate', webhookUpdate => {
  //log.log('[webhookUpdate] - ' + webhookUpdate);
  //console.log('[webhookUpdate]');
});

/**************************************************************************************************************/
/* GUILD                                                                                                      */
/**************************************************************************************************************/

//Emitted whenever the client joins a guild.
client.on('guildCreate', async guild => {
  //Whether the guild is available to access. If it is not available, it indicates a server outage 
  if (guild.available) {
    //no config set
    db.get_config(guild).then(config => {
      if (!config || config.length == 0) {
        db.set_config(guild);
      } else {
        db.set_guildactive(guild, 1);
      }
    })
  }
});

//Emitted whenever a guild is deleted/left.
client.on('guildDelete', async guild => {
  db.set_guildactive(guild, 0);
});

/**************************************************************************************************************/
/* MEMBER                                                                                                     */
/**************************************************************************************************************/

//Emitted whenever a user joins a guild.
client.on('guildMemberAdd', async member => {
  db.get_config(member.guild).then((config) => {
    if (config && config.length >= 0) {
      if (config[0].welcome === 1 && config[0].welcome_channel && config[0].botlog) {

        const chn = member.guild.channels.get(config[0].welcome_channel),
          server_icon = (member.guild.iconURL !== null) ? member.guild.iconURL : '';
        if (!member.user.bot) {
          const welcomemsg = new Discord.RichEmbed()
            .setColor('#000000')
            .setAuthor('Welcome', server_icon)
            .setDescription(member.user.toString() + ' Welcome to the LPGG-Discord, enjoy your stay!')
            .setImage('https://steamuserimages-a.akamaihd.net/ugc/845963567852349042/400307109ECE5B0975C57845FFFB2B5C023A3841/');
          chn.send(welcomemsg);
        } else {
          const welcomemsg = new Discord.RichEmbed()
            .setColor('#000000')
            .setDescription(member.user.toString() + ' (bot) joined');
          chn.send(welcomemsg);
        }
      }
    }
  }).catch((error) => {
    log.log('[guildMemberAdd] - ' + member.guild.id + ' : ' + error);
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
    log.log('[guildMemberRemove] - ' + member.guild.id + ' : ' + error);
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
    const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
  }
  client.emit(events[event.t], reaction, user, message);
});

//Emitted whenever a reaction is added to a cached message.
client.on('messageReactionAdd', async (reaction, user, message) => {
  if (reaction.me && message && !user.bot) {
    const channelID = message.channel.id,
      messageID = message.id,
      emoteID = punycode.encode((reaction.emoji.id !== null) ? reaction.emoji.name + ':' + reaction.emoji.id : reaction.emoji.name),
      response = await reactions.get_reaction(message.guild, channelID, messageID, emoteID);

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
      emoteID = punycode.encode((reaction.emoji.id !== null) ? reaction.emoji.name + ':' + reaction.emoji.id : reaction.emoji.name),
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
  msghandler.handler(client, message);
});

client.login(auth.token);