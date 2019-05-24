const Discord   = require("discord.js");
const client    = new Discord.Client();
const auth      = require("./auth.json");
const punycode  = require('punycode');
const fs        = require('fs');

//own scripts
const log       = require("./js/log");
const status    = require("./js/status");
const badwords  = require("./js/badwords");
const db        = require("./js/db");

//Bot-Settings
let StatusInterval = JSON.parse(fs.readFileSync('config.json', 'utf8')).statusIntervall;
let arr_badwords   = [];

//Functions current
/*
* - log-file
* - status
* - badwords
*/

/*
Todos

DB
* - config rows standard: NULL
* - general row 'active'

Patreon Page
*/

//Events
/**************************************************************************************************************/
/* BOT STARTS                                                                                                 */
/**************************************************************************************************************/
client.on('ready', async () => {
  //log.log('[ready] - bot start');
  console.log('ready');
  function setStatus(){
    status.set_status(client);
  }
  setInterval(setStatus, 216000);
  arr_badwords = await badwords.get_badwords();
});
/**************************************************************************************************************/
/* ERROR HANDLING                                                                                             */ 
/**************************************************************************************************************/

//Emitted whenever the client's WebSocket encounters a connection error.
client.on('error', error => {
  log.log('[error] - ' + error);
  console.log('[error]');
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
  if(guild.available){
    //no config set
    if(db.get_config(guild) === undefined){
      //set config with standard
      db.set_config(guild);
    } else {
      //set guild active = true
      db.set_guildactive(guild, true);
    }
  }
});

//Emitted whenever a guild is deleted/left.
client.on('guildDelete', async guild => {
  db.set_guildactive(guild, false);
});

/**************************************************************************************************************/
/* MEMBER                                                                                                     */ 
/**************************************************************************************************************/

//Emitted whenever a user joins a guild.
client.on('guildMemberAdd', async member => {
  
});

//Emitted whenever a member leaves a guild, or is kicked.
client.on('guildMemberRemove', async member => {
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
client.on('messageReactionAdd', async (reaction, user, message)  => {//
  if(reaction.me === true && message !== undefined){
    let channelID = message.channel.id;
    let messageID = message.id;
    let emoteID   = (reaction.emoji.id !== null) ? reaction.emoji.name + ':' + reaction.emoji.id : punycode.ucs2.decode(reaction.emoji.name);

    let response = await db.reactions(message, 'check', channelID, messageID, emoteID);

    if(response.error == false && response.value !== null && user.bot === false){
      message.guild.members.get(user.id).addRole(response.value);
    }
  }
});

//Emitted whenever a reaction is removed from a cached message.
client.on('messageReactionRemove', async (reaction, user, message) => {
  if(reaction.me === true && message !== undefined){ //bot reacts before
    let channelID = message.channel.id;
    let messageID = message.id;
    let emoteID   = (reaction.emoji.id !== null) ? reaction.emoji.name + ':' + reaction.emoji.id : punycode.ucs2.decode(reaction.emoji.name);

    let response = await db.reactions(message, 'check', channelID, messageID, emoteID);

    if(response.error == false && response.value !== null && user.bot === false){
      message.guild.members.get(user.id).removeRole(response.value);
    }
  }
});

/**************************************************************************************************************/
/* MESSAGES                                                                                                   */
/**************************************************************************************************************/

//Emitted whenever a message is created.
client.on("message", async message => {
  
});

client.login(auth.token);