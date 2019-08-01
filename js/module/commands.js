//requiere
const msg_send = require("../msg_send"),
  admin = require("../admin"),
  Discord = require("discord.js"),
  log = require("../log"),
  NodeCache = require('node-cache');

const delCache = new NodeCache({
    stdTTL: 300 //5min ttl
  }),
  class_del_msg = class class_del_msg {
    constructor(user, content) {
      this.user = user;
      this.content = content;
    }
  },
  arr_del_msg = new Array();

exports.del = async (client, message) => {
  try {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      if (admin.isDigit(args[0])) {
        if (args[0] <= 100) {
          message.channel.bulkDelete(args[0]).then(msg => {
            const msg_cache = msg;
            msg.map(el => {
              let obj = new class_del_msg(el.author.username, el.content);
              arr_del_msg.push(obj);
            });
            return msg_cache;
          }).then((msg) => {
            msg_send.embedMessage(client, message.channel.id, 'clear', `${msg.size} messages deleted.`, '000000', 5000);
          }).then(() => {
            delCache.set(message.guild.id + message.channel.id, arr_del_msg);
          }).catch(err => {
            throw err;
          });
        } else {
          msg_send.embedMessage(client, message.channel.id, 'clear', 'cant delete more than 100 messages at once.', 'ff0000', 5000);
        }
      } else {
        msg_send.embedMessage(client, message.channel.id, 'clear', `${args[0]} isnt an digit`, 'ff0000', 5000);
      }
    }
  } catch (err) {
    throw err;
  }
}

exports.undel = (client, message) => {
  try {
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      delCache.get(message.guild.id + message.channel.id, (err, val) => {
        if (!err) {
          message.channel.send('**__Recover:__**');
          val.map(el => message.channel.send('**' + el.user + ':** ' + (content = el.content || '_(cant recover)_')));
        }
      });
    }
  } catch (err) {
    throw err;
  }
}


exports.clear = async (client, message) => {
  try {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      if (admin.isDigit(args[0])) {
        if (args[0] <= 100) {
          message.channel.bulkDelete(args[0])
            .then(msg => msg_send.embedMessage(client, message.channel.id, 'clear', `${msg.size} messages deleted.`, '000000', 5000))
            .catch(console.error);
        } else {
          msg_send.embedMessage(client, message.channel.id, 'clear', 'cant delete more than 100 messages at once.', 'ff0000', 5000);
        }
      } else {
        msg_send.embedMessage(client, message.channel.id, 'clear', args[0] + ' isnt a number.', 'ff0000', 5000);
      }
    }
  } catch (err) {
    log.log(err);
  }
}

exports.serverinfo = async (config, message) => {
  try {
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      const guild = message.guild,
        owner = guild.owner.user,
        timezones = {
          'brazil': 'D/M/Y',
          'eu-central': 'D/M/Y',
          'hongkong': 'D/M/Y',
          'india': 'D/M/Y',
          'japan': 'Y/M/D',
          'russia': 'D/M/Y',
          'singapore': 'Y/M/D',
          'southafrica': 'Y/M/D',
          'sydney': 'D/M/Y',
          'us-central': 'M/D/Y',
          'us-east': 'M/D/Y',
          'us-south': 'M/D/Y',
          'us-west': 'M/D/Y',
          'eu-west': 'D/M/Y'
        },
        timeformat = (Object.keys(timezones).includes(guild.region)) ? timezones[guild.region] : 'D/M/Y',
        createdAt = timeformat.replace(/D/gmi, guild.createdAt.getDate()).replace(/M/gmi, guild.createdAt.getMonth() + 1).replace(/Y/gmi, guild.createdAt.getUTCFullYear()),
        countroles = guild.roles.size,
        online = guild.presences.size,
        memberCount = guild.memberCount,
        bots = guild.members.filter(el => el.user.bot == true).size,
        member = guild.members.filter(el => el.user.bot == false).size,
        channels = guild.channels.size,
        textchannels = guild.channels.filter(el => el.type === 'text').size,
        voicechannels = guild.channels.filter(el => el.type === 'voice').size,
        exampleEmbed = new Discord.RichEmbed()
        .setColor('#000000')
        .setTitle('Server-Info')
        .addField('Owner', owner, true)
        .addField('Premium', false, true)
        .addField('Server created', createdAt, true)
        .addField('Total Roles', countroles, true)
        .addField('Total Members', memberCount + ' members (' + online + ' online)\n' + bots + ' bots  \n' + member + ' human ', true)
        .addField('Total Channels', channels + ' channels\n' + textchannels + ' text \n' + voicechannels + ' voice ', true);

      message.channel.send(exampleEmbed);
    }
  } catch (err) {
    log.log(err);
  }
}

exports.img = async (config, client, message) => {
  if (admin.isAdmin(message) || admin.isMod(message, config)) {
    const args = await admin.cut_cmd(message);
    if (admin.isChannel(args[0]) &&
      client.channels(args[0]) &&
      args[1] &&
      admin.isURL(args[1])) {
      msg_send.img(client, args[0].replace(/[<#>]/gm, ''), args[1]);
    }
  }
}

exports.embedimg = async (config, client, message) => {
  if (admin.isAdmin(message) || admin.isMod(message, config)) {
    const args = await admin.cut_cmd(message);
    if (admin.isChannel(args[0]) &&
      client.channels(args[0]) &&
      args[1] &&
      admin.isURL(args[1])) {
      msg_send.img(client, args[0].replace(/[<#>]/gm, ''), args[1]);
    }
  }
}