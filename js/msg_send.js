exports.embedMessage = function (client, channel_id, name, value, color, timer) {
  color = parseInt(color.replace('#', ''), 16);
  client.channels.get(channel_id).send({
    embed: {
      color: color,
      fields: [{
        name: name,
        value: value
      }]
    }
  }).then(msg => {
    if (timer) msg.delete(timer);
  });
}

exports.img = (client, channel_id, url) => {
  client.channels(channel_id).send('', {
    files: url
  });
}

exports.embedimg = (client, channel_id, url) => {
  client.channels(channel_id).send({
    color: 000,
    image: {
      url: url
    }
  });
}


/*
exports.msg = () => {
  const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addField('Regular field title', 'Some value here')
	.addBlankField()
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

  channel.send(exampleEmbed);
}*/