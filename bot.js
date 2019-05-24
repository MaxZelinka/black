const Discord   = require("discord.js");
const auth      = require("./auth.json");
const client    = new Discord.Client();

//own scripts
const log       = require("./js/log");
const status    = require("./js/status");
const badwords  = require("./js/badwords");

//Bot-Settings
const StatusInterval = 216000;
let arr_badwords   = [];

//Functions current
/*
* - log-file
* - status
* - badwords
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
/* GUILD CREATED / LEAVE                                                                                      */ 
/**************************************************************************************************************/

//Emitted whenever the client joins a guild.
client.on('guildCreate', async guild => {
});

//Emitted whenever a guild is deleted/left.

client.on("message", async message => {
  
});

client.login(auth.token);