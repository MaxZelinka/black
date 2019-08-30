/**************************************************************************************************************/
/* BIRTHDAY COMMAND                                                                                           */
/**************************************************************************************************************/

/*
Required modules:
 - admin
 - msgsend
 - db
*/

exports.bday = async (modules, config, client, message) => {
    try {
        const cf_prefix = config[0].Prefix;
        const args = await modules.admin.cut_cmd(message);

        switch (args[0]) {
            case 'help':
                info();
                break;
            default:
                info();
                break;
        }

        function add() {

        }

        function del() {

        }

        function role() {

        }

        function info() {
            modules.msgsend.embedMessage(client, message.channel.id, 'Help', `Avialeble commands:
          ${cf_prefix}bday add [date e.g.:01.01.1999] - add your bday
          ${cf_prefix}bday del - delete your bday
          ${cf_prefix}bday role [role] - set the bday role
          ${cf_prefix}bday help - show help(this)`, '000');
        }
    } catch (err) {
        modules.log.log_(modules, err);
    }
}