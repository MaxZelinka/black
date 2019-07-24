//requiere
const fspromise = require('fs.promises'),
    mysql = require('promise-mysql'),
    log = require("./log");

async function get_fileconfig() {
    return await fspromise.readFile('./config.json', 'utf8')
        .then(data => JSON.parse(data))
        .catch(error => log.log('[get_fileconfig] - ' + error));
}

async function conn() {
    return await get_fileconfig().then(async DBconfig => {
        return result = await mysql.createConnection({
            host: DBconfig.servername,
            user: DBconfig.username,
            password: DBconfig.password,
            database: DBconfig.dbname
        });
    });
}

async function _query(query) {
    //console.log(query);
    try {
        return conn().then(async (conn) => {
            let result = await conn.query(query);
            conn.end();
            return result;
        }).catch((error) => {
            throw error;
        });
    } catch (err) {
        log.log('[query] (' + query + ') - ' + err);
    }
}

exports.query = async (query) => {
    return _query(query);
}

//CONFIG
exports.get_config = async (guild) => {
    return _query(`SELECT * FROM general
    INNER JOIN config ON general.ServerID = config.ServerID
    INNER JOIN module ON general.ServerID = module.ServerID
    WHERE general.ServerID = ` + guild.id);
}

exports.set_config = async (guild) => {
    const general = _query(`INSERT INTO general (ServerID, ServerName, Prefix, active)
    VALUES('` + guild.id + `','` + guild.name + `','?b', 1)`)
        .then(() => {
            _query(`INSERT INTO config (ServerID, welcomemsg)
        VALUES('` + guild.id + `','{user} welcome to the server! :)')`);
            _query(`INSERT INTO module (ServerID)
        VALUES('` + guild.id + `')`);
        });
    if (general !== undefined) {
        return true;
    } else {
        return undefined;
    }
}

exports.set_guildactive = async (guild, flag) => {
    return _query(`UPDATE general SET active = ` + flag + ` WHERE ServerID = ` + guild.id);
}

//REACTIONS
exports.set_reaction = async (guild, channel_ID, message_ID, emote_ID, role_ID) => {
    return conn().then(async (conn) => {
        const query_set = `INSERT INTO reactions (ServerID, ChannelID, MessageID, EmoteID, RoleID, ID)
        VALUES('` + guild.id + `', 
        '` + channel_ID + `', 
        '` + message_ID + `', 
        '` + emote_ID + `', 
        '` + role_ID + `',
        '` + channel_ID + message_ID + emote_ID + role_ID + `')`;
        return conn.query(query_set).then(async (el) => {
            if (el !== undefined) {
                return _query(`SELECT reactionsID FROM reactions WHERE ServerID = '` + guild.id +
                    `' AND ID = '` + channel_ID + message_ID + emote_ID + role_ID + `';`);
            } else {
                return undefined;
            }
        });
    }).catch((error) => {
        log.log('[set_reaction] - ' + guild.id + ' : ' + error);
        return undefined;
    });
}

exports.get_reaction = async (guild, channelID, messageID, emoteID) => {
    return _query(`SELECT RoleID FROM reactions WHERE ServerID = '` + guild.id + `' 
    AND ChannelID = '` + channelID + `' 
    AND MessageID = '` + messageID + `' 
    AND EmoteID = '` + emoteID + `';`);
}