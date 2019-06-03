const msg_send = require("../msg_send");
const admin = require("../admin");
const Discord = require("discord.js");

async function msg_delete(message, number_msg) {
  const msgs = await message.channel.fetchMessages();

  let msgcounter = 0;

  msgs.map(msg => {
    if (msgcounter <= number_msg) {
      msg.delete();
    }
    msgcounter++;
  });
}

exports.clear = (client, message) => {
  const args = message.content.trim().split(/ +/g);
  args.shift();

  if (admin.isAdmin(message) === true ||
    admin.isMod(message, config) === true ||
    admin.hasPerm('serverinfo', message)) {
    if (args[0].match(/[\d]*/gm) !== null) {
      msg_delete(message, args[0]).then(() => {
        msg_send.embedMessage(client, message.channel.id, 'clear', args[0] + ' messages deleted.', '000000', 5000);
      });
    } else {
      msg_send.embedMessage(client, message.channel.id, 'clear', args[0] + ' isnt a number.', 'ff0000', 5000);
    }
  }
}

exports.serverinfo = async (config, message) => {
  if (admin.isAdmin(message) === true ||
    admin.isMod(message, config) === true ||
    admin.hasPerm('serverinfo', message)) {

    const guild = message.guild;

    const timezones = {
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
    }

    const owner = guild.owner.user;
    const timeformat = (Object.keys(timezones).includes(guild.region)) ? timezones[guild.region] : 'D/M/Y';
    //const timeformat = 'D/M/Y';
    const createdAt = timeformat.replace(/D/gmi, guild.createdAt.getDate()).replace(/M/gmi, guild.createdAt.getMonth() + 1).replace(/Y/gmi, guild.createdAt.getUTCFullYear());
    const countroles = guild.roles.size;
    const online = guild.presences.size;
    const memberCount = guild.memberCount;
    const bots = guild.members.filter(el => el.user.bot == true).size;
    const member = guild.members.filter(el => el.user.bot == false).size;
    const channels = guild.channels.size;
    const textchannels = guild.channels.filter(el => el.type === 'text').size;
    const voicechannels = guild.channels.filter(el => el.type === 'voice').size;

    const exampleEmbed = new Discord.RichEmbed()
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
}