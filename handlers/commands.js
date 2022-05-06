const fs = require('fs');

module.exports = (client) => {
    const folders = fs.readdirSync('./commands/');

    folders.forEach((dir) => {
        const commandFiles = fs.readdirSync(`./commands/${dir}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);

            if (command.name) {
                client.commands.set(command.name, command);
                console.log(`Command loaded >>> from: '${dir}', name: '${command.name}'`);
            }
            else {
                console.log(`ERROR: ${file} missing help.name `);
            }
        }
    });

    console.log('> All commands loadaded.');
};
