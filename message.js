exports.send_embed_message = (client, guild_id, channel_id, color, title, value, timer) => {
    let color_code = parseInt(color.replace('#', ''), 16) || '000';

    client.guilds.get(guild_id).channels.get(channel_id).send({
        embed: {
            color: color_code,
            fields: [{
                name: title || '',
                value: value || ''
            }]
        }
    }).then(msg => {
        if (timer) msg.delete(timer);
    });
}