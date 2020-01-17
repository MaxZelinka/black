const discord = require("discord.js");
const event = require('../event');
const node_fetch = require('node-fetch');
const cronjob = require('node-cron');
const random = require('random');
const database = require('../database');

/*
Autor:          Necromant
Date:           14.01.2020
Description:    Day-Events
*/

/*init*/
(function init() {
    // event.add_event('ready', 'days', 'database');
    // event.add_event('guildCreate', 'days', 'add_guild');
    // event.add_event('guildDelete', 'days', 'del_guild');
    event.add_event('ready', 'days', 'giphy');
}());

exports.database = (client, args) => {
    database.query('CREATE TABLE `lpggbot_`.`days` ( `Server_ID` varchar(20) NOT NULL PRIMARY KEY, `Channel_ID` VARCHAR(20) NULL) ENGINE = InnoDB;').then(rp => {
        if (rp) console.log('[modul] Days | create Database');
    });
}

exports.add_guild = (client, args) => {
    database.query('INSERT INTO `lpggbot_`.`days`(`Server_ID`) VALUES (' + args.guild.id + ');').then(rp => {
        if (rp) console.log('[modul] Days | create Database Entry for ' + args.guild.id);
    });
}

exports.del_guild = (client, args) => {
    database.query('DELETE FROM `lpggbot_`.`days` WHERE `Server_ID`= ' + args.guild.id + ';').then(rp => {
        if (rp) console.log('[modul] Days | delete Database Entry for ' + args.guild.id);
    });
}

exports.giphy = (client, args) => {
    cronjob.schedule('0 0 9 * * *', () => {
        fetch(client, 'good morning', random.int(0, 365), 'Good Morning!');
    });

    cronjob.schedule('0 0 20 24 12 *', () => {
        fetch(client, 'christmas', random.int(0, 100), 'Happy Christmas!');
    });

    cronjob.schedule('0 0 0 1 1 *', () => {
        fetch(client, 'happy new year', random.int(0, 100), 'Happy New Year!');
    });
}

function fetch(client, search, offset, text) {
    node_fetch('http://api.giphy.com/v1/gifs/search?api_key=h7P6AQTeIKHs5Vl7qGZxJA2uwehup7V3&q=' + search + '&limit=1&offset=' + offset)
        .then(res => res.json())
        .then(json => {
            const embed = new discord.RichEmbed()
                .setColor('000000')
                .setImage('https://media.giphy.com/media/' + json.data[0].id + '/giphy.gif')
                .setDescription(text);
            client.guilds.get('312477482836295681').channels.get('562208160329498624').send({
                embed
            })
        }).catch(err => {
            console.log(err);
        });
}