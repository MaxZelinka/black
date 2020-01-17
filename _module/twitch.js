const discord = require("discord.js");
const event = require('../event');
const node_fetch = require('node-fetch');
const database = require('../database');
const cronjob = require('node-cron');
const moment = require('moment');

/*
Autor:          Necromant
Date:           17.01.2020
Description:    Twitch integration
*/

/*init*/
(function init() {
    event.add_event('ready', 'twitch', 'database');
    // event.add_event('ready', 'twitch', 'twitch');
}());

exports.database = (client, args) => {
    database.query('CREATE TABLE `lpggbot_`.`twitch` (`ID` int AUTO_INCREMENT PRIMARY KEY, `Server_ID` varchar(20) NOT NULL, `Channel_ID` VARCHAR(20) NULL, `User_Name` VARCHAR(255) NULL) ENGINE = InnoDB;').then(rp => {
        if (rp) console.log('[modul] Twitch | create Database');
    });
}

exports.twitch = (client, args) => {
    cronjob.schedule('* * * * * *', () => {
        client.guilds.map(async (guild) => {
            database.query('SELECT * FROM `lpggbot_`.`twitch` WHERE `Server_ID` = ' + guild.id).then(guild => {
                guild.map(guild => {
                    fetch(client, guild.User_Name, guild.Server_ID, guild.Channel_ID);
                })
            });
        })
    });
}


/* check whenether messages is send yet */
function fetch(client, user_login, Guild_ID, Channel_ID) {

    node_fetch('https://api.twitch.tv/helix/streams?user_login=' + user_login, {
        headers: {
            'Client-ID': 'kb5jsbinsj8hm52nfp0q1r1l6rgobt',
        },
    })
        .then(res => res.json())
        .then(json => {
            if (json.data[0]) { //live
                // console.log(json.data[0] //game_id //viewer_count);
                const embed = new discord.RichEmbed()
                    .setColor('000000')
                    .setTitle(json.data[0].user_name + ' [ LIVE ]')
                    .setURL('https://www.twitch.tv/' + json.data[0].user_name)
                    .setImage(json.data[0].thumbnail_url.replace(/(\{width\})/g,'400').replace(/(\{height\})/g,'225'))
                    .setTimestamp(json.data[0].started_at)
                    .setDescription(json.data[0].title)
                    .setFooter('Live since');
                client.guilds.get(Guild_ID).channels.get(Channel_ID).send({
                    embed
                })
            } else { //not live
                
            }
        });
}
