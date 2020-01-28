/*
Autor:          Necromant
Date:           16.01.2020
Description:    Timers for iterative messages
*/

const discord = require("discord.js");
const event = require('../event');
const database = require('../database');
const _general = require('./_general');
const moment = require("moment");

(function init() {
    event.add_event('ready', 'timers', 'database');
    event.add_event('ready', 'timers', 'read_timers');
}());

exports.database = (client, args) => {
    database.query('CREATE TABLE IF NOT EXISTS `lpggbot_`.`timers` ( `Server_ID` varchar(20) NOT NULL PRIMARY KEY, `Channel_ID` TEXT NULL, `time` varchar(255) NULL, `day` varchar(255) NULL,  `Message` TEXT NULL ) ENGINE = InnoDB;');
}

var timers;
function get_timers(){
    timers = database.query('SELECT * FROM `lpggbot_`.`timers` WHERE `day` = ' + moment().day() + ';').then(rp => (rp) ? rp : null);
}

exports.read_timers = (client, args) => {
    get_timers();
}

exports.message = (client, args) => {

}

