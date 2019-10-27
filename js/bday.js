/**************************************************************************************************************/
/* BIRTHDAY COMMAND                                                                                           */
/**************************************************************************************************************/

/*
Required modules:
 - admin
 - msgsend
 - db
*/

/*
db: birthday_user
ID, UserID, Birthday

db: birthday_config
ID, ServerID, distRoles 1/0
*/

exports.bday = async (modules, config, client, message) => {
    try {
        const cf_prefix = config[0].Prefix;
        const args = await modules.admin.cut_cmd(message);

        switch (args[0]) {
            case 'help':
                info();
                break;
            case 'del' :
                del();
                break;
            case 'role' :
                role();
                break;
            case 'add' :
            default:
                add();
                break;
        }

        function add() {
            /**
             * E: 19.11.1993 | 
             * V: timestamp
             * A: B-Day saved
             */
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