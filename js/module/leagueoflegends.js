const fetch = require("node-fetch");
const msg_send = require("../msg_send");
const admin = require("../admin");

//Create Roles
/*
const guild = client.guilds.get('581147107033874455');

const tiers = [
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

let roles = guild.roles.filter(el => tiers.includes(el.name));
roles = roles.map(el => el.name);

tiers.map(el => {
  if(roles.includes(el) === false){
    guild.createRole({
      name: el
    });
  } 
});*/
const api_key = 'RGAPI-06ae383a-4045-4d80-b1ad-c0306de1e805';

const regio = {
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
};

function get_summoner(region, name) {
  return fetch('https://' + regio[region] + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + name + '?api_key=' + api_key, {
      method: 'GET'
    })
    .then(summoner => summoner.json())
    .catch(err => {
      if (err) throw err;
    });
}

function get_thirdparty(region, summoner_id) {
  return fetch('https://' + regio[region] + '.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/' + summoner_id + '?api_key=' + api_key, {
      method: 'GET'
    })
    .then(third_party => third_party.json())
    .catch(err => {
      if (err) throw err;
    });
}

function get_rank(region, summoner_id) {
  return fetch('https://' + regio[region] + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summoner_id + '?api_key=' + api_key, {
      method: 'GET'
    })
    .then(rank => rank.json())
    .catch(err => {
      if (err) throw err;
    });
}

function get_masteries(region, summoner_id) {
  return fetch('https://' + regio[region] + '.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + summoner_id + '?api_key=' + api_key, {
      method: 'GET'
    })
    .then(masteries => masteries.json())
    .catch(err => {
      if (err) throw err;
    });
}

function get_champion(id) {
  return fetch('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
    .then(champion => champion.json())
    .then(champion => Object.values(champion.data).filter(champ => champ.key == id))
    .catch(err => {
      if (err) throw err;
    });
}

exports.get_lol = async (config, client, message) => {
  const args = message.content.trim().split(/ +/g);
  args.shift();

  const region = args[0].toLowerCase();
  const user = args[1];

  get_summoner(region, user).then(summoner => {
    if (summoner.status_code === undefined) {
      get_rank(region, summoner.id).then(rank => {
        get_masteries(region, summoner.id).then(async masteries => {
          const thumb = (masteries.length > 0) ? 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/' + (await get_champion(masteries[0].championId))[0].name.replace(/[^\w]/gm, '') + '.png' : '';
          const opgg = 'https://' + region + '.op.gg/summoner/userName=' + summoner.name.replace(/ /gm,'%20');

          const champ_0 = (masteries[0] !== undefined) ? (await get_champion(masteries[0].championId))[0].name + ' - ' + new Intl.NumberFormat().format(masteries[0].championPoints) : '';
          const champ_1 = (masteries[1] !== undefined) ? (await get_champion(masteries[1].championId))[0].name + ' - ' + new Intl.NumberFormat().format(masteries[1].championPoints) : '';
          const champ_2 = (masteries[2] !== undefined) ? (await get_champion(masteries[2].championId))[0].name + ' - ' + new Intl.NumberFormat().format(masteries[2].championPoints) : '';

          const solo_Q = rank.filter(rank => rank.queueType == 'RANKED_SOLO_5x5');
          const flex_55 = rank.filter(rank => rank.queueType == 'RANKED_FLEX_SR');
          const flex_TT = rank.filter(rank => rank.queueType == 'RANKED_FLEX_TT');;

          const Embed = new Discord.RichEmbed()
            .setColor('#000000')
            .setAuthor(summoner.name, thumb, opgg)
            .setDescription(champ_0 + '\n' + champ_1 + '\n' + champ_2)

          if (solo_Q.length > 0) {
            Embed.addField('Solo Q', solo_Q[0].tier.substr(0, 1) + solo_Q[0].tier.substr(1).toLowerCase() + ' ' + solo_Q[0].rank)
          }
          if (flex_55.length > 0) {
            Embed.addField('Flex 5x5', flex_55[0].tier.substr(0, 1) + flex_55[0].tier.substr(1).toLowerCase() + ' ' + flex_55[0].rank)
          }
          if (flex_TT.length > 0) {
            Embed.addField('Flex TT', flex_TT[0].tier.substr(0, 1) + flex_TT[0].tier.substr(1).toLowerCase() + ' ' + flex_TT[0].rank)
          }

          client.guilds.get('312477482836295681').channels.get('312477482836295681').send(Embed);
        });
      })
    } else {
      console.log('Cant find summoner.');
    }
  });
}

exports.setlolAcc = async (config, client, message) => {
  const api_key = 'RGAPI-06ae383a-4045-4d80-b1ad-c0306de1e805';
  const args = message.content.trim().split(/ +/g);
  args.shift();

  //Problem: Fake-Acc can be used.

  const regio = {
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
  };

  if (admin.isAdmin(message) === true ||
    admin.isMod(message, config) === true ||
    admin.hasPerm('setlolAcc', message)) {

    if (args[0] !== undefined && args[1] !== undefined) {
      if (Object.keys(regio).includes(args[0].toLowerCase())) {

        fetch('https://' + regio[args[0].toLowerCase()] + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + args[1] + '?api_key=' + api_key, {
            method: 'GET'
          })
          .then(summoner => summoner.json())
          .then(summoner => {
            fetch('https://' + regio[args[0].toLowerCase()] + '.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/' + summoner.id + '?api_key=' + api_key, {
                method: 'GET'
              })
              .then(third_party => third_party.json())
              .then(third_party => {
                if (third_party.status === undefined) {
                  console.log(third_party);
                  if (third_party == summoner.id) {
                    if (summoner.status === undefined || summoner.status.status_code !== 404) {
                      fetch('https://' + regio[args[0].toLowerCase()] + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summoner.id + '?api_key=' + api_key, {
                          method: 'GET'
                        })
                        .then(rank => rank.json())
                        .then(rank => {
                          if (rank.status === undefined) {

                            if (rank.length > 0) {
                              //ranked
                              const rang = rank.filter(el => el.queueType == 'RANKED_SOLO_5x5');
                              if (rang.length > 0) {
                                //soloQ
                                const tier = rang[0].tier.substring(0, 1) + rang[0].tier.substring(1).toLowerCase();

                                msg_send.embedMessage(client, message.channel.id, 'League of Legends', '**' + args[1] + ' (' + args[0] + ')**\n' + tier, '#000000');
                                //const role = message.guild.roles.filter(el => el.name === tier);
                                //message.member.addRole(role.first().id);
                              } else {
                                msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'No SoloQ played.', '#ff0000', 5000);
                              }
                            } else {
                              msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'No SoloQ played.', '#ff0000', 5000);
                            }
                          } else {
                            msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Summoner not found.', '#ff0000', 5000);
                          }
                        }).catch(err => console.log(err));
                    } else {
                      msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Summoner not found.', '#ff0000', 5000);
                    }
                  } else {
                    msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Third-Party-Key not set or wrong.\nPlease set the Key to "' + summoner.id + '" and try again.', '#ff0000');
                  }
                } else {
                  msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'Third-Party-Key not set.\nPlease set the Key to "' + summoner.id + '" and try again.', '#ff0000');
                }
              }).catch(err => console.log(err));
          }).catch(err => console.log(err));
      } else {
        msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'region not found.\n avieleble regios: ' + Object.keys(regio).toString(), '#ff0000', 5000);
      }
    } else {
      msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'missing argument.', '#ff0000', 5000);
    }
  }
}