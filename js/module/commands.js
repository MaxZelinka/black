//requiere
const msg_send = require("../msg_send"),
  admin = require("../admin"),
  Discord = require("discord.js"),
  log = require("../log"),
  NodeCache = require('node-cache');

const delCache = new NodeCache({
    stdTTL: 300 //5min ttl
  }),
  class_del_msg = class class_del_msg {
    constructor(user, content) {
      this.user = user;
      this.content = content;
    }
  },
  arr_del_msg = new Array();

// exports.file = async (modules, config, client, message) => {
//   try {
//     if (message.author.id == '287281691746238464' || message.author.id == '369502541811286018') {
//       const cf_prefix = config[0].Prefix;
//       const args = await admin.cut_cmd(message);
//       switch (args[0]) {
//         case 'add':
//           add();
//           break;
//         case 'del':
//           del();
//           break;
//         case 'list':
//           list();
//           break;
//         case 'help':
//           info();
//           break;
//         default:
//           info();
//           break;
//       }

//       function get_files(path) {
//         return fs.readdirSync(path).sort((a, b) => naturalCompare(a, b));
//       }

//       function add() {
//         try {
//           const url = args[1];
//           if (admin.isURL(url)) {
//             const filename = url.substr(url.lastIndexOf("/") + 1);
//             modules.request.get(url)
//               .on('error', console.error)
//               .pipe(modules.fs.createWriteStream('downloads/' + filename));
//             msg_send.embedMessage(client, message.channel.id, 'download', 'Downloadpath: downloads/' + filename, '000');
//           } else {
//             msg_send.embedMessage(client, message.channel.id, 'download', 'no valid url', 'ff0000', 5000);
//           }
//         } catch (err) {
//           modules.msg_send.error(modules, client, message, message.channel.id, 'downloads', err);
//         }
//       }

//       function del() {
//         args.shift();
//         if (args) {
//           const filename = args.toString().replace(/[,]/gm, ' ');
//           try {
//             modules.fs.unlink('./downloads/' + filename, (err) => {
//               if (err) {
//                 msg_send.embedMessage(client, message.channel.id, 'download', 'no such file', '#ff0000', 5000)
//               } else {
//                 msg_send.embedMessage(client, message.channel.id, 'Files', `File ${filename} deleted.`, '#000');
//               }
//             });
//           } catch (err) {
//             modules.msg_send.error(modules, client, message, message.channel.id, 'downloads', err);
//           }
//         }
//       }

//       function list() {
//         try {
//           let choosen = (args[1]) ? args[1] : 0;
//           let files = get_files('./downloads');
//           const a_arr = 10;
//           const b_arr = Math.ceil(files.length / a_arr);
//           const arr = new Array(b_arr);
//           for (let i_b = 0; i_b < b_arr; i_b++) {
//             let arr_cache = new Array(a_arr);
//             for (let i_a = 0; i_a < a_arr; i_a++) {
//               arr_cache[i_a] = files.shift();
//             }
//             arr[i_b] = arr_cache;
//           }
//           for (let index = 0; index < a_arr; index++) {
//             message.channel.send('downloads/' + arr[choosen][index]);
//           }
//         } catch (err) {
//           msg_send.error(modules, client, message, message.channel.id, 'downloads', err);
//         }
//         // try {
//         //   modules.fs.readdir(modules.path.join('./downloads'), (err, files) => {
//         //     if (err) msg_send.embedMessage(client, message.channel.id, 'download', 'Unable to scan directory.', '#ff0000', 5000);
//         //     files.forEach(file => {
//         //       message.channel.send('downloads/' + file);
//         //     });
//         //   });
//         // } catch (err) {
//         //   modules.msg_send.error(modules, client, message, message.channel.id, 'downloads', err);
//         // }
//       }

//       function info() {
//         msg_send.embedMessage(client, message.channel.id, 'Help', `Avialeble commands:
//         ${cf_prefix}file add [url] - download/add an file
//         ${cf_prefix}file del [filename] - delete an file
//         ${cf_prefix}file list [index] - list all files
//         ${cf_prefix}file help - show help(this)`, '000');
//       }
//     }
//   } catch (err) {
//     msg_send.error(modules, client, message, message.channel.id, 'download', err);
//   }
// }

exports.hi = async (modules, client, message) => {
  try {
    msg_send.embedMessage(client, message.channel.id, 'hi', 'hi there! :)', '000');
  } catch (err) {
    msg_send.error(modules, client, message, message.channel.id, 'hi', err);
  }
}

exports.del = async (client, message) => {
  try {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      if (admin.isDigit(args[0])) {
        if (args[0] <= 100) {
          message.channel.bulkDelete(args[0]).then(msg => {
            const msg_cache = msg;
            msg.map(el => {
              let obj = new class_del_msg(el.author.username, el.content);
              arr_del_msg.push(obj);
            });
            return msg_cache;
          }).then((msg) => {
            msg_send.embedMessage(client, message.channel.id, 'clear', `${msg.size} messages deleted.`, '000000', 5000);
          }).then(() => {
            delCache.set(message.guild.id + message.channel.id, arr_del_msg);
          }).catch(err => {
            throw err;
          });
        } else {
          msg_send.embedMessage(client, message.channel.id, 'clear', 'cant delete more than 100 messages at once.', 'ff0000', 5000);
        }
      } else {
        msg_send.embedMessage(client, message.channel.id, 'clear', `${args[0]} isnt an digit`, 'ff0000', 5000);
      }
    }
  } catch (err) {
    throw err;
  }
}

exports.undel = (client, message) => {
  try {
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      delCache.get(message.guild.id + message.channel.id, (err, val) => {
        if (!err && val) {
          message.channel.send('**__Recover:__**');
          val.map(el => message.channel.send('**' + el.user + ':** ' + (content = el.content || '_(cant recover)_')));
        }
      });
    }
  } catch (err) {
    throw err;
  }
}


exports.clear = async (client, message) => {
  try {
    const args = await admin.cut_cmd(message);
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      if (admin.isDigit(args[0])) {
        if (args[0] <= 100) {
          message.channel.bulkDelete(args[0])
            .then(msg => msg_send.embedMessage(client, message.channel.id, 'clear', `${msg.size} messages deleted.`, '000000', 5000))
            .catch(console.error);
        } else {
          msg_send.embedMessage(client, message.channel.id, 'clear', 'cant delete more than 100 messages at once.', 'ff0000', 5000);
        }
      } else {
        msg_send.embedMessage(client, message.channel.id, 'clear', args[0] + ' isnt a number.', 'ff0000', 5000);
      }
    }
  } catch (err) {
    log.log(err);
  }
}

exports.serverinfo = async (config, message) => {
  try {
    if (admin.isAdmin(message) || admin.isMod(message, config)) {
      const guild = message.guild,
        owner = guild.owner.user,
        timezones = {
          'brazil': 'D/M/Y',
          'eu-central': 'D/M/Y',
          'hongkong': 'D/M/Y',
          'india': 'D/M/Y',
          'japan': 'Y/M/D',
          'russia': 'D/M/Y',
          'singapore': 'Y/M/D',
          'southafrica': 'Y/M/D',
          'sydney': 'D/M/Y',
          'us-central': 'M/D/Y',
          'us-east': 'M/D/Y',
          'us-south': 'M/D/Y',
          'us-west': 'M/D/Y',
          'eu-west': 'D/M/Y'
        },
        timeformat = (Object.keys(timezones).includes(guild.region)) ? timezones[guild.region] : 'D/M/Y',
        createdAt = timeformat.replace(/D/gmi, guild.createdAt.getDate()).replace(/M/gmi, guild.createdAt.getMonth() + 1).replace(/Y/gmi, guild.createdAt.getUTCFullYear()),
        countroles = guild.roles.size,
        online = guild.presences.size,
        memberCount = guild.memberCount,
        bots = guild.members.filter(el => el.user.bot == true).size,
        member = guild.members.filter(el => el.user.bot == false).size,
        channels = guild.channels.size,
        textchannels = guild.channels.filter(el => el.type === 'text').size,
        voicechannels = guild.channels.filter(el => el.type === 'voice').size,
        exampleEmbed = new Discord.RichEmbed()
        .setColor('#000000')
        .setTitle('Server-Info')
        .addField('Owner', owner, true)
        .addField('Premium', false, true)
        .addField('Server created', createdAt, true)
        .addField('Total Roles', countroles, true)
        .addField('Total Members', memberCount + ' members (' + online + ' online)\n' + bots + ' bots  \n' + member + ' human ', true)
        .addField('Total Channels', channels + ' channels\n' + textchannels + ' text \n' + voicechannels + ' voice ', true);

      message.channel.send(exampleEmbed);
    }
  } catch (err) {
    log.log(err);
  }
}

exports.img = async (config, client, message) => {
  if (admin.isAdmin(message) || admin.isMod(message, config)) {
    const args = await admin.cut_cmd(message);
    const channel_id = args[0].replace(/[<#!>]/gm, '');
    if (admin.isChannel(args[0]) &&
      client.channels.get(channel_id) &&
      args[1]) {
      msg_send.img(client, channel_id, args[1]);
    }
  }
}

exports.embedimg = async (config, client, message) => {
  if (admin.isAdmin(message) || admin.isMod(message, config)) {
    const args = await admin.cut_cmd(message);
    const channel_id = args[0].replace(/[<#!>]/gm, '');
    if (admin.isChannel(args[0]) &&
      client.channels.get(channel_id) &&
      args[1]) {
      msg_send.embedimg(client, channel_id, args[1]);
    }
  }
}