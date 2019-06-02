const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const fs = require('fs');
const punycode = require('punycode');

//own scripts
const log = require("./js/log");
const status = require("./js/status");
const db = require("./js/db");
const msghandler = require("./js/messagehandler");
const modhandler = require("./js/modulhandler");
const msg_send  = require("./js/msg_send");

//Bot-Settings
let StatusInterval = JSON.parse(fs.readFileSync('config.json', 'utf8')).statusIntervall;
let arr_badwords = [];

//Functions current
/*
* - log-file
* - status
* - badwords
* - welcome/leave msg
*/

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
  
  function setStatus() {
    status.set_status(client);
  }
  setInterval(setStatus, 216000);
});
/**************************************************************************************************************/
/* ERROR HANDLING                                                                                             */
/**************************************************************************************************************/

//Emitted whenever the client's WebSocket encounters a connection error.
client.on('error', error => {
  log.log('[error] - ' + error);
  console.log('[error]');
  console.log(error);
});

//Emitted when the client hits a rate limit while making a request
client.on('rateLimit', rateLimit => {
  log.log('[rateLimit] - ' + rateLimit);
  console.log('[rateLimit]');
});

//Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
client.on('disconnect', disconnect => {
  log.log('[disconnect] - ' + disconnect);
  console.log('[disconnect]');
});

//Emitted whenever the client tries to reconnect to the WebSocket.
client.on('reconnecting', reconnecting => {
  log.log('[reconnecting] - ' + reconnecting);
  console.log('[reconnecting]');
});

//Emitted for general warnings.
client.on('warn', warn => {
  log.log('[warn] - ' + warn);
  console.log('[warn]');
});

//Emitted whenever a guild text channel has its webhooks changed.
client.on('webhookUpdate', webhookUpdate => {
  log.log('[webhookUpdate] - ' + webhookUpdate);
  console.log('[webhookUpdate]');
});

/**************************************************************************************************************/
/* GUILD                                                                                                      */
/**************************************************************************************************************/

//Emitted whenever the client joins a guild.
client.on('guildCreate', async guild => {
  //Whether the guild is available to access. If it is not available, it indicates a server outage 
  if (guild.available) {
    //no config set
    let config = await db.get_config(guild);
    if (config == undefined || config.length == 0) {
      //set config with standard
      db.set_config(guild);
    } else {
      //set guild active = true
      db.set_guildactive(guild, 1);
    }
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
    if (config !== undefined && config.length >= 0) {
      //if module is active
      if (config[0].welcome === 1 && config[0].welcomelog !== null) {
        let user = member.user.toString();
        let server = member.guild.name;
        let welcomelog = config[0].welcome_channel;
        let welcomemsg = config[0].welcomemsg.replace(/{user}/gmi, user).replace(/{server}/gmi, server);

        if (member.user.bot === false) {
          member.guild.channels.get(welcomelog).send(welcomemsg, {
            file: 'https://media.discordapp.net/attachments/416512556975521793/560400583031259136/lly3amxgwsc21.jpg'
          });
        } else {
          member.guild.channels.get(config.botlog).send(user + '(bot) joined.');
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
  const { d: data } = event;
  const user = client.users.get(data.user_id);
  const channel = client.channels.get(data.channel_id) || await user.createDM();

  //if (channel.messages.has(data.message_id)) return; //event trigger 2 times without this

  const message = await channel.fetchMessage(data.message_id);
  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
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
  if(reaction.me === true && message !== undefined){
    const channelID = message.channel.id;
    const messageID = message.id;
    const emoteID   = punycode.encode((reaction.emoji.id !== null) ? reaction.emoji.name + ':' + reaction.emoji.id : reaction.emoji.name);

    const response = await modhandler.get_reaction(message.guild, channelID, messageID, emoteID);

    if(response !== undefined && response.length > 0){
      message.guild.members.get(user.id).addRole(response[0].RoleID).catch((error) => {
        console.log(error);
      });
    }
  }
});

//Emitted whenever a reaction is removed from a cached message.
client.on('messageReactionRemove', async (reaction, user, message) => {
  if(reaction.me === true && message !== undefined){
    const channelID = message.channel.id;
    const messageID = message.id;
    const emoteID   = punycode.encode((reaction.emoji.id !== null) ? reaction.emoji.name + ':' + reaction.emoji.id : reaction.emoji.name);

    const response = await modhandler.get_reaction(message.guild, channelID, messageID, emoteID);

    if(response !== undefined && response.length > 0){
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