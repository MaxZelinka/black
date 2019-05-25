exports.embedMessage = function(client, id, name, value, color){
    client.channels.get(id).send({embed: {
      color: color,
      fields: [{
          name: name,
          value: value
        }
      ]
    }
    });
}
