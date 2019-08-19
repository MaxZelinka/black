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
	console.log(url);
  /*
	client.channels.get(channel_id).send('Test', {
    files: url
  });*/
}

exports.embedimg = (client, channel_id, url) => {
  client.channels.get(channel_id).send({
    color: 000,
    image: {
      url: url
    }
  });
}

exports.error = (modules, client, message, channel_id, title, err) => {
  client.channels.get(channel_id).send({
    embed: {
      color: 'ff0000',
      fields: [{
        name: title,
        value: 'oops smth went wrong :('
      }]
    }
  }).then(msg => {
    msg.delete(5000);
  });
  modules.log.log(err);
}