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

exports.setlolAcc = async (config, client, message) => {
    const api_key = 'RGAPI-1172847b-64ba-4e10-a633-4cb5f28511c5';
    const args = message.content.trim().split(/ +/g);
    args.shift();

    //Problem: Fake-Acc can be used.

    const regio = {
        'ru' : 'ru',
        'kr' : 'kr',
        'br' : 'br1',
        'oce' : 'oc1',
        'jp' : 'jp1',
        'na' : 'na1',
        'eune' : 'eun1',
        'euw' : 'euw1',
        'tr' : 'tr1',
        'lan' : 'la1',
        'las' : 'la2'
    };

    if (admin.isAdmin(message) === true ||
        admin.isMod(message, config) === true ||
        admin.hasPerm('setlolAcc', message)) {
            
        if(args[0] !== undefined && args[1] !== undefined){
            if(Object.keys(regio).includes(args[0].toLowerCase())){

                fetch('https://' + regio[args[0].toLowerCase()] + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + args[1] + '?api_key=' + api_key, {
                    method: 'GET'
                  })
                  .then(summoner => summoner.json())
                  .then(summoner => {
                    if (summoner.status === undefined || summoner.status.status_code !== 404) {
                      fetch('https://' + regio[args[0].toLowerCase()] + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summoner.id + '?api_key=' + api_key, {
                          method: 'GET'
                        })
                        .then(rank => rank.json())
                        .then(rank => {
                          if (rank.status === undefined) {
                            
                            if(rank.length > 0){
                              //ranked
                              const rang = rank.filter(el => el.queueType == 'RANKED_SOLO_5x5');
                              if(rang.length > 0){
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
                  }).catch(err => console.log(err));

            } else {
                msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'region not found.\n avieleble regios: ' + Object.keys(regio).toString(), '#ff0000', 5000);
            }
        } else {
            msg_send.embedMessage(client, message.channel.id, 'League of Legends', 'missing argument.', '#ff0000', 5000);
        }    
    }
}