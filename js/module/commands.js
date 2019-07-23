//requiere
const msg_send = require("../msg_send"),
  admin = require("../admin"),
  Discord = require("discord.js"),
  log = require("../log");

exports.clear = (client, message) => {
  try {
    const args = admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      if (admin.isDigit(args[0])) {
        if (args[0] <= 100) {
          channel.bulkDelete(args[0])
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

exports.imgmsg = (config, client, message) => {
  if (admin.isAdmin(message) || admin.isMod(message, config)) {
    const args = admin.cut_cmd(message);
    const rich = new Discord.RichEmbed()
      .setImage(args[1])
      .setColor('000');

    if (admin.isChannel(args[0]) && admin.isURL(args[1])) {
      client.guilds.get(message.guild.id).channels.get(args[0].replace(/[<#>]/gm, '')).send(rich);
    }
  }
}