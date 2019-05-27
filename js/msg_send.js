const admin = require("./admin");

exports.embedMessage = function(client, channel_id, name, value, color, timer){
  color = admin.to_colorcode(color).toString();  
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