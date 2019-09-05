/**************************************************************************************************************/
/* FILE SYSTEM                                                                                                */
/**************************************************************************************************************/

/*
Required modules:
 - admin
 - msgsend
 - fs
 - request
*/

const dir = 'downloads/';

function readdir(modules, path) {
    try {
        return modules.fs.readdirSync(path).sort((a, b) => modules.naturalCompare(a, b));
    } catch (err) {
        console.log(err);
    }
}

function unlink(modules, path) {
    try {
        return modules.fs.unlink(path, err => err);
    } catch (err) {
        console.log(err);
    }
}

exports.readdir = (modules, path) => readdir(modules, path);
exports.unlink = (modules, path) => unlink(modules, path);

exports.file = async (modules, config, client, message) => {
    try {
        if (message.author.id == '287281691746238464' || message.author.id == '369502541811286018') {
            const cf_prefix = config[0].Prefix;
            const args = await modules.admin.cut_cmd(message);
            switch (args[0]) {
                case 'add':
                    add();
                    break;
                case 'del':
                    del();
                    break;
                case 'list':
                    list();
                    break;
                case 'help':
                    info();
                    break;
                default:
                    info();
                    break;
            }

            function add() {
                try {
                    const url = args[1];
                    if (modules.admin.isURL(url)) {
                        const filename = url.substr(url.lastIndexOf("/") + 1);
                        modules.request.get(url)
                            .on('error', console.error)
                            .pipe(modules.fs.createWriteStream(dir + filename));
                        modules.msgsend.embedMessage(client, message.channel.id, 'file', `Path: ${dir + filename}`, '000');
                    } else {
                        modules.msgsend.embedMessage(client, message.channel.id, 'file', 'no valid url', 'ff0000', 5000);
                    }
                } catch (err) {
                    modules.msgsend.error(modules, client, message, message.channel.id, 'file', err);
                }
            }

            function del() {
                args.shift();
                if (args) {
                    const filename = args.toString().replace(/[,]/gm, ' ');
                    try {
                        if (!unlink(modules, dir + filename)) {
                            modules.msgsend.embedMessage(client, message.channel.id, 'file', `file ${filename} deleted.`, '#000');
                        } else {
                            modules.msgsend.embedMessage(client, message.channel.id, 'file', 'no such file', '#ff0000', 5000)
                        }
                    } catch (err) {
                        modules.msgsend.error(modules, client, message, message.channel.id, 'file', err);
                    }
                }
            }

            function list() {
                try {
                    let choosen = (args[1]) ? args[1] : 0;
                    let files = readdir(modules, './downloads');
                    const a_arr = 10;
                    const b_arr = Math.ceil(files.length / a_arr);
                    const arr = new Array(b_arr);
                    for (let i_b = 0; i_b < b_arr; i_b++) {
                        let arr_cache = new Array(a_arr);
                        for (let i_a = 0; i_a < a_arr; i_a++) {
                            arr_cache[i_a] = files.shift();
                        }
                        arr[i_b] = arr_cache;
                    }
                    for (let index = 0; index < a_arr; index++) {
                        if (arr[choosen][index]) {
                            message.channel.send(dir + arr[choosen][index]);
                        }
                    }
                } catch (err) {
                    modules.msgsend.error(modules, client, message, message.channel.id, 'file', err);
                }
            }

            function info() {
                modules.msgsend.embedMessage(client, message.channel.id, 'Help', `Avialeble commands:
          ${cf_prefix}file add [url] - download an file
          ${cf_prefix}file del [filename] - delete an file
          ${cf_prefix}file list [index] - list all files
          ${cf_prefix}file help - show help(this)`, '000');
            }
        }
    } catch (err) {
        modules.msgsend.error(modules, client, message, message.channel.id, 'file', err);
    }
}