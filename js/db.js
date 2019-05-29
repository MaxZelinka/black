const fs = require('fs');
const fspromise = require('fs.promises');
var mysql = require('promise-mysql');
const fetch = require("node-fetch");

//own scripts
const log = require("./log");

async function get_fileconfig() {
    return await fspromise.readFile('./config.json', 'utf8').then(data => {
            return data;
        })
        .catch(error => {
            log.log('[get_fileconfig] - ' + error);
        });
}

async function conn() {
    return await get_fileconfig().then(async DBconfig => {
        DBconfig = JSON.parse(DBconfig).db;
        return result = await mysql.createConnection({
            host: DBconfig.servername,
            user: DBconfig.username,
            password: DBconfig.password,
            database: DBconfig.dbname
        });
    });
}

async function _query(query) {
    return conn().then(async (conn) => {
        let result = await conn.query(query);
        conn.end();
        return result;
    }).catch((error) => {
        log.log('[query] (' + query + ') - ' + error);
        return undefined;
    });
}

exports.query = async (query) => {
    return _query(query);
    /*return conn().then(async (conn) => {
        let result = conn.query(query);
        conn.end();
        return result;
    }).catch((error) => {
        log.log('[query] (' + query + ') - ' + guild.id + ' : ' + error);
        return undefined;
    });*/
}

//CONFIG
exports.get_config = async (guild) => {
    return _query(`SELECT * FROM general
    INNER JOIN config ON general.ServerID = config.ServerID
    INNER JOIN module ON general.ServerID = module.ServerID
    WHERE general.ServerID = ` + guild.id);
    /*
    return conn().then(async (conn) => {
        const query = `SELECT * FROM general
        INNER JOIN config ON general.ServerID = config.ServerID
        INNER JOIN module ON general.ServerID = module.ServerID
        WHERE general.ServerID = ` + guild.id;
        let result = await conn.query(query);
        conn.end();
        return result;
    }).catch((error) => {
        log.log('[get_config] - ' + guild.id + ' : ' + error);
        return undefined;
    });*/
}

exports.set_config = async (guild) => {
    return conn().then(async (conn) => {
        const query_general = `INSERT INTO general (ServerID, ServerName, Prefix, active)
            VALUES('` + guild.id + `','` + guild.name + `','?b', 1)`;
        const query_config = `INSERT INTO config (ServerID, welcomemsg)
            VALUES('` + guild.id + `','{user} welcome to the server! :)')`;
        const query_module = `INSERT INTO module (ServerID)
            VALUES('` + guild.id + `')`;
        conn.query(query_general);
        conn.query(query_config);
        conn.query(query_module);
        conn.end();
        return true;
    }).catch((error) => {
        log.log('[set_config] - ' + guild.id + ' : ' + error);
        return undefined;
    });
}

exports.set_guildactive = async (guild, flag) => {
    return _query(`UPDATE general SET active = ` + flag + ` WHERE ServerID = ` + guild.id);
    /*
    return conn().then(async (conn) => {
        const query = `UPDATE general SET active = ` + flag + ` WHERE ServerID = ` + guild.id;
        conn.query(query);
        conn.end();
        return true;
    }).catch((error) => {
        log.log('[set_guildactive] - ' + guild.id + ' : ' + error);
        return undefined;
    });
    */
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
        return conn.query(query_set).then((el) => {
            if (el !== undefined) {
                return _query(`SELECT reactionsID FROM reactions WHERE ServerID = ` + guild.id +
                ` AND ID = ` + channel_ID + message_ID + emote_ID + role_ID + `;`);
                /*
                const query_get = `SELECT reactionsID FROM reactions WHERE ServerID = ` + guild.id +
                    ` AND ID = ` + channel_ID + message_ID + emote_ID + role_ID + `;`;
                let result = conn.query(query_get);
                conn.end();
                return result;
                */
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
    return _query(`SELECT RoleID FROM reactions WHERE ServerID = ` + guild.id +
    ` AND ChannelID = ` + channelID +
    ` AND MessageID = ` + messageID +
    ` AND EmoteID = ` + emoteID + `;`);
    /*return conn().then(async (conn) => {
        const query = `SELECT RoleID FROM reactions WHERE ServerID = ` + guild.id +
            ` AND ChannelID = ` + channelID +
            ` AND MessageID = ` + messageID +
            ` AND EmoteID = ` + emoteID + `;`;
        let result = conn.query(query);
        conn.end();
        return result;
    }).catch((error) => {
        log.log('[get_reaction] - ' + guild.id + ' : ' + error);
        return undefined;
    });*/
}
