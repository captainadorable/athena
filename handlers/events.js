const fs = require('fs');

module.exports = (client) => {
    const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const Event = require(`../events/${file}`);
            Event.event = Event.event || file.replace('.js', '');
            client.on(file.split('.')[0], (...args) => Event(client, ...args));
            console.log(`> Event '${Event.event}' loaded.`);
        }
        catch (err) {
            console.log(err);
        }
    }
};
