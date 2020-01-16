const discord = require("discord.js");
const event = require('../event');
const node_fetch = require('node-fetch');
const cronjob = require('node-cron');
const random = require('random');
/*
Autor:          Necromant
Date:           14.01.2020
Description:    Say Good Morning every day (for the current time zone with an random giphy gif)
*/

/*init*/
(function init() {
    event.add_event('ready', 'goodmorning', 'giphy');
}());

exports.giphy = (client, args) => {
    cronjob.schedule('* * 9 * * *', () => {
        node_fetch('http://api.giphy.com/v1/gifs/search?api_key=h7P6AQTeIKHs5Vl7qGZxJA2uwehup7V3&q=good%20morning&limit=1&offset=' + random.int(0, 365))
            .then(res => res.json())
            .then(json => {
                const embed = new discord.RichEmbed()
                    .setColor('000000')
                    .setImage('https://media.giphy.com/media/' + json.data[0].id + '/giphy.gif')
                    .setDescription('Good Morning!');
                client.guilds.get('312477482836295681').channels.get('562208160329498624').send({
                    embed
                })
            }).catch(err => {
                console.log(err);
            });
    })
}