//require
const fetch = require("node-fetch"),
  msg_send = require("../msg_send"),
  admin = require("../admin"),
  Discord = require("discord.js"),
  log = require("../log"),
  NodeCache = require('node-cache');

//const
const Cache = new NodeCache({
  stdTTL: 1800
}); //30min ttl
const champ_Chache = new NodeCache({
  stdTTL: 86400
}); //24H ttl

const api_key = 'RGAPI-06ae383a-4045-4d80-b1ad-c0306de1e805',
  regio = {
    'ru': 'ru',
    'kr': 'kr',
    'br': 'br1',
    'oce': 'oc1',
    'jp': 'jp1',
    'na': 'na1',
    'eune': 'eun1',
    'euw': 'euw1',
    'tr': 'tr1',
    'lan': 'la1',
    'las': 'la2'
  },
  img_url = {
    'Challenger': 'https://i.ibb.co/5FBN7pV/Emblem-Challenger.png',
    'Grandmaster': 'https://i.ibb.co/rbmqZ5Q/Emblem-Grandmaster.png',
    'Master': 'https://i.ibb.co/4Vx1L2P/Emblem-Master.png',
    'Diamond': 'https://i.ibb.co/QdQHh1B/Emblem-Diamond.png',
    'Platinum': 'https://i.ibb.co/xLt1g2m/Emblem-Platinum.png',
    'Gold': 'https://i.ibb.co/5G8stwK/Emblem-Gold.png',
    'Silver': 'https://i.ibb.co/d0dMCBQ/Emblem-Silver.png',
    'Bronze': 'https://i.ibb.co/D13bBRN/Emblem-Bronze.png',
    'Iron': 'https://i.ibb.co/8PN8YHm/Emblem-Iron.png'
  },
  ranks = {
    'I': 1,
    'II': 2,
    'III': 3,
    'IV': 4,
    'V': 5
  },
  tiers = [
    'Challenger',
    'Grandmaster',
    'Master',
    'Diamond',
    'Platinum',
    'Gold',
    'Silver',
    'Bronze',
    'Iron'
  ];

function createRoles(message) {
  let roles = message.guild.roles.filter(el => tiers.includes(el.name));
  roles = roles.map(el => el.name);
  tiers.map(el => {
    if (roles.includes(el) === false) {
      message.guild.createRole({
        name: el
      });
    }
  });
}

function get_thirdparty(region, summoner_id) {
  try {
    return fetch('https://' + regio[region] + '.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/' + summoner_id + '?api_key=' + api_key, {
        method: 'GET'
      })
      .then(third_party => third_party.json())
      .catch(err => {
        throw err;
      });
  } catch (err) {
    log.log(err);
    return undefined;
  }
}

function get_summoner(region, name) {
  try {
    return fetch('https://' + regio[region] + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURI(name) + '?api_key=' + api_key, {
        method: 'GET'
      })
      .then(summoner => summoner.json())
      .catch(err => {
        throw err;
      });
  } catch (err) {
    log.log(err);
    return undefined;
  }
}

function get_rank(region, summoner_id) {
  try {
    return fetch('https://' + regio[region] + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summoner_id + '?api_key=' + api_key, {
        method: 'GET'
      })
      .then(rank => rank.json())
      .catch(err => {
        throw err;
      });
  } catch (err) {
    log.log(err);
    return undefined;
  }
}

function get_masteries(region, summoner_id) {
  try {
    return fetch('https://' + regio[region] + '.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + summoner_id + '?api_key=' + api_key, {
        method: 'GET'
      })
      .then(masteries => masteries.json())
      .catch(err => {
        throw err;
      });
  } catch (err) {
    log.log(err);
    return undefined;
  }
}

function filter_champs(id) {
  const champs = (champ_Chache.get('champs')) ? champ_Chache.get('champs') : await get_champs();
  if (!champ_Chache.get('champs')) champ_Chache.set('champs', champs);
  return Object.values(champs.data).filter(champ => champ.key == id);
}

function get_champs() {
  return fetch('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
    .then(champion => champion.json())
    .catch(err => console.log(err));
}

/*
function get_champion(id) {
  try {
    return fetch('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
      .then(champion => champion.json())
      .then(champion => Object.values(champion.data).filter(champ => champ.key == id))
      .catch(err => {
        throw err;
      });
  } catch (err) {
    log.log(err);
    return undefined;
  }
}*/

exports.get_lol = async (config, client, message) => {
  const args = admin.cut_cmd(message);
  if (args[0] && args[1]) {
    const region = args[0].toLowerCase();
    args.shift();
    const user = args.toString().replace(/[,]/gm, ' ');

    if (Object.keys(regio).includes(region)) {
      const loading = new Discord.RichEmbed()
        .setColor('#000')
        .setURL('https://discord.js.org/')
        .setAuthor('loading', 'https://media1.tenor.com/images/50337fc1e603a4726067ed3a5127ee9e/tenor.gif?itemid=5488360', 'https://discord.js.org')
        .setDescription(user);

      message.channel.send(loading).then(msg => {
        get_summoner(region, user).then(summoner => {
          if (summoner.id) {
            get_rank(region, summoner.id).then(rank => {
              get_masteries(region, summoner.id).then(async masteries => {
                const thumb = (masteries.length > 0) ? 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + (await filter_champs(masteries[0].championId))[0].name.replace(/[^\w]/gm, '') + '.png' : '';
                const opgg = 'https://' + region + '.op.gg/summoner/userName=' + encodeURI(summoner.name);

                const champ_0 = (masteries[0]) ? (await filter_champs(masteries[0].championId))[0].name + ' (' + new Intl.NumberFormat().format(masteries[0].championPoints) + ') ' : '';
                const champ_1 = (masteries[1]) ? (await filter_champs(masteries[1].championId))[0].name + ' ( ' + new Intl.NumberFormat().format(masteries[1].championPoints) + ') ' : '';
                const champ_2 = (masteries[2]) ? (await filter_champs(masteries[2].championId))[0].name + ' ( ' + new Intl.NumberFormat().format(masteries[2].championPoints) + ') ' : '';

                const solo_Q = rank.filter(rank => rank.queueType == 'RANKED_SOLO_5x5');
                const flex_55 = rank.filter(rank => rank.queueType == 'RANKED_FLEX_SR');
                const flex_TT = rank.filter(rank => rank.queueType == 'RANKED_FLEX_TT');;

                const Embed = new Discord.RichEmbed()
                  .setColor('#000000')
                  .setAuthor(summoner.name, thumb, opgg)
                  .setDescription(champ_0 + '\n' + champ_1 + '\n' + champ_2);

                if (solo_Q.length > 0) {
                  const wr = (parseFloat((solo_Q[0].wins / (solo_Q[0].wins + solo_Q[0].losses)) * 100).toFixed(2)).replace(/[.]/gm, ',');
                  Embed.addField('Ranked Solo', solo_Q[0].tier.substr(0, 1) + solo_Q[0].tier.substr(1).toLowerCase() + ' ' + ranks[solo_Q[0].rank] + ' (' + solo_Q[0].leaguePoints + ' LP)' +
                    '\n' + wr + '% / ' + solo_Q[0].wins + 'W ' + solo_Q[0].losses + 'L');

                  Embed.setThumbnail(img_url[solo_Q[0].tier.substr(0, 1) + solo_Q[0].tier.substr(1).toLowerCase()]);
                }
                if (flex_55.length > 0) {
                  const wr = (parseFloat((flex_55[0].wins / (flex_55[0].wins + flex_55[0].losses)) * 100).toFixed(2)).replace(/[.]/gm, ',');
                  Embed.addField('Ranked Flex 5v5', flex_55[0].tier.substr(0, 1) + flex_55[0].tier.substr(1).toLowerCase() + ' ' + ranks[flex_55[0].rank] + ' (' + flex_55[0].leaguePoints + ' LP)' +
                    '\n' + wr + '% / ' + flex_55[0].wins + 'W ' + flex_55[0].losses + 'L');
                }

                if (flex_TT.length > 0) {
                  const wr = (parseFloat((flex_TT[0].wins / (flex_TT[0].wins + flex_TT[0].losses)) * 100).toFixed(2)).replace(/[.]/gm, ',');
                  Embed.addField('Ranked Flex 3v3', flex_TT[0].tier.substr(0, 1) + flex_TT[0].tier.substr(1).toLowerCase() + ' ' + ranks[flex_TT[0].rank] + ' (' + flex_TT[0].leaguePoints + ' LP)' +
                    '\n' + wr + '% / ' + flex_TT[0].wins + 'W ' + flex_TT[0].losses + 'L');
                }

                msg.delete().then(() => {
                  message.channel.send(Embed);
                });
              });
            }).catch(err => {
              msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Cant get rank.', '#ff0000', 5000);
              msg.delete();
              log.log(err);
            });
          } else {
            msg.delete();
            msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Cant find summoner.', '#ff0000', 5000);
          }
        }).catch(err => {
          msg.delete();
          log.log(err);
        });
      });
    } else {
      msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'region not found.\n avieleble regios: ' + Object.keys(regio).toString(), '#ff0000', 5000);
    }
  } else {
    msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'missing arguments.', '#ff0000', 5000);
  }
}

exports.set_lol = async (config, client, message) => {
  const args = admin.cut_cmd(message);
  if (args[0] && args[1]) {
    const region = args[0].toLowerCase();
    args.shift();
    const user = args.toString().replace(/[,]/gm, ' ');

    if (Object.keys(regio).includes(region)) {
      //create roles, if not set yet.
      createRoles(message);

      get_summoner(region, user).then(summoner => {
        if (summoner.id) {
          get_thirdparty(region, summoner.id).then(third_party => {
            if (third_party == summoner.id.substr(0, 10)) {
              get_rank(region, summoner.id).then(rank => {
                const solo_Q = rank.filter(rank => rank.queueType == 'RANKED_SOLO_5x5');
                if (solo_Q.length > 0) {
                  const tiername = solo_Q[0].tier.substr(0, 1) + solo_Q[0].tier.substr(1).toLowerCase(),
                    roles = message.guild.roles.filter(el => tiers.includes(el.name));
                  roles.map(role => {
                    if (role.name === tiername) {
                      message.member.addRole(role.id);
                      msg_send.embedMessage(client, message.channel.id, 'League of Legends', `set Rank: ${role.name}`, '#000000', 5000);
                    } else {
                      message.member.removeRole(role.id);
                    }
                  });
                } else {
                  msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Unranked.', '#000000', 5000);
                }
              }).catch(err => {
                msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Cant get rankk.', '#ff0000', 5000);
                log.log(err);
              });
            } else {
              message.member.send(`Set the Third-Party-Key to: ${summoner.id.substr(0, 10)} \n\nhttps://i.imgur.com/HPo8ztC.png`);
            }
          }).catch(() => {
            message.member.send(`No Third-Party-Key set yet or RIOT API Error.\nSet your Third-Party-Key to: ${summoner.id.substr(0, 10)} \n\nhttps://i.imgur.com/HPo8ztC.png`);
          });
        } else {
          msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Cant find summoner.', '#ff0000', 5000);
        }
      }).catch(err => {
        msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Cant find summoner.', '#ff0000', 5000);
        log.log(err);
      });

    } else {
      msg_send.embedMessage(client, message.channel.id, 'League of Legends', `region not found.\n avieleble regios: ${Object.keys(regio).toString()}`, '#ff0000', 5000);
    }
  } else {
    msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'missing argument.', '#ff0000', 5000);
  }
}