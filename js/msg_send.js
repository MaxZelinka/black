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