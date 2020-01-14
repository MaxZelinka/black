/*
Autor:          Necromant
Date:           14.01.2020
Description:    Create General-Settings in the Database and more
*/

/*init*/
(function init() {

}());

exports.isAdmin = (args) => {
    return (args.member.hasPermission('ADMINISTRATOR')) ? true : false;
}


/*
TODO

Functions:
isAdmin
isMod (DB)
isChannel
isUser
isRole

*/