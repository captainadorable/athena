module.exports = async (client) => {

    client.user.setPresence({
        status: 'dnd',
    });
    client.user.setActivity('I\'m ready my Lord.');

    console.log(client.user.username + ' has landed.');
};