exports.embedMessage = function(client, channel_id, name, value, color, timer){
  color = parseInt(color.replace('#', ''), 16);  
  client.channels.get(channel_id).send({embed: {
    color: color,
    fields: [{
        name: name,
        value: value
      }
    ]
  }
  }).then(msg => {
    if(timer !== undefined){
      msg.delete(timer);
    }
  });
}