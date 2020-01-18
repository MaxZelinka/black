const discord = require("discord.js");
const event = require('../event');
const node_fetch = require('node-fetch');
const database = require('../database');
const cronjob = require('node-cron');
const node_cache = require('node-cache');
const Games = new node_cache({ stdTTL: 86400, checkperiod: 86400 }); //1 day

/*
Autor:          Necromant
Date:           17.01.2020
Description:    Twitch integration
*/

/*init*/
(function init() {
    event.add_event('ready', 'twitch', 'database');
    event.add_event('ready', 'twitch', 'twitch');
}());

exports.database = (client, args) => {
    database.query('CREATE TABLE `lpggbot_`.`twitch` (`ID` int AUTO_INCREMENT PRIMARY KEY, `Server_ID` varchar(20) NOT NULL, `Channel_ID` VARCHAR(20) NULL, `User_Name` VARCHAR(255) NULL) ENGINE = InnoDB;').then(rp => {
        if (rp) console.log('[modul] Twitch | create Database');
    });
}

exports.twitch = (client, args) => {
    var streamer_liste = [];
    database.query('SELECT DISTINCT `User_Name` FROM `lpggbot_`.`twitch`').then(streamer => {

        streamer.map(el => {
            streamer_liste[el.User_Name] = '';
        })

        cronjob.schedule('0 2 * * * *', () => {
            client.guilds.map(async (guild) => {
                database.query('SELECT * FROM `lpggbot_`.`twitch` WHERE `Server_ID` = ' + guild.id).then(guild => {
                    guild.map(guild => {
                        fetch(client, guild.User_Name, guild.Server_ID, guild.Channel_ID, streamer_liste);
                    })
                });
            })
        });
    });
}


/* check whenether messages is send yet */
function fetch(client, user_login, Guild_ID, Channel_ID, streamer_liste) {
    node_fetch('https://api.twitch.tv/helix/streams?user_login=' + user_login, {
        headers: {
            'Client-ID': 'kb5jsbinsj8hm52nfp0q1r1l6rgobt',
        },
    })
        .then(res => res.json())
        .then(streamer => {
            if (streamer && streamer.data[0]) { //live
                if (streamer_liste[streamer.data[0].user_name.toLowerCase()] != 'Live') {
                    streamer_liste[streamer.data[0].user_name.toLowerCase()] = 'Live';

                    node_fetch('https://api.twitch.tv/helix/users?id=' + streamer.data[0].user_id, {
                        headers: {
                            'Client-ID': 'kb5jsbinsj8hm52nfp0q1r1l6rgobt',
                        },
                    })
                        .then(res => res.json())
                        .then(user => {
                            var Game_Name = (Games.get(streamer.data[0].game_id)) ? Game_Name = Games.get(streamer.data[0].game_id) : node_fetch('https://api.twitch.tv/helix/games?id=' + streamer.data[0].game_id, {
                                headers: {
                                    'Client-ID': 'kb5jsbinsj8hm52nfp0q1r1l6rgobt',
                                },
                            })
                                .then(res => res.json())
                                .then(game => Game_Name = game.data[0].name, Games.set(streamer.data[0].game_id, game.data[0].name));

                            const embed = new discord.RichEmbed()
                                .setColor('000000')
                                .setAuthor(streamer.data[0].user_name, user.data[0].profile_image_url, 'https://www.twitch.tv/' + streamer.data[0].user_name)
                                .setTitle(streamer.data[0].title)
                                .setURL('https://www.twitch.tv/' + streamer.data[0].user_name)
                                .setImage(streamer.data[0].thumbnail_url.replace(/(\{width\})/g, '400').replace(/(\{height\})/g, '225'))
                                .addField('Games', Game_Name, true)
                                .addField('Viewers', streamer.data[0].viewer_count, true)
                                .setTimestamp(streamer.data[0].started_at)
                                .setFooter('Live');
                            client.guilds.get(Guild_ID).channels.get(Channel_ID).send({
                                embed
                            })
                        })
                }
            } else { //not live
                if (streamer_liste[user_login] == 'Live') {
                    streamer_liste[user_login] = '';
                }
            }
        });
}
