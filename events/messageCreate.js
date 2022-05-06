const discord = require('discord.js');
const config = require('../config.json');

module.exports = async (client, message) => {
    if (message.content.toLowerCase().includes('allah') && !message.author.bot) return await message.reply({ content: 'Did someone mention `allah`? <@821306766242349076>' });

    const prefix = config.prefix;

    const prefixEmbed = new discord.MessageEmbed()
        .setColor(config.color)
        .setDescription(`Chill bro, chill. My prefix: \`${prefix}\``);
    if (message.content === `<@${client.user.id}>` || message.content === `<@${client.user.id}`) return message.channel.send({ embeds: [prefixEmbed] });

    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmda = args.shift().toLowerCase();
    const command =
        client.commands.get(cmda) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmda));

    if (!command) return;

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new discord.Collection());
    }

    const now = Date.now();
    const timeStamp = client.cooldowns.get(command.name) || new discord.Collection();
    let cool = command.cooldown || 3;
    const userCool = timeStamp.get(message.author.id) || 0;
    const estimated = userCool + cool * 1000 - now;

    if (userCool && estimated > 0) {
        cool = new discord.MessageEmbed().setDescription(`Hey come on. Wait ${(estimated / 1000).toFixed()}s more before reusing the ${command.name} command.`);
        return await message.reply({ embeds: [cool] }).then((msg) => {
            setTimeout(() => msg.delete().catch(() => null), estimated);
        });
    }

    timeStamp.set(message.author.id, now);
    client.cooldowns.set(command.name, timeStamp);
    try {
        command.run(client, message, args);
    }
    catch (error) {
        console.log('[ERROR] >>> ' + error);
        message.reply({ content: 'there was an error trying to execute that command!' });
    }
    finally {
        console.log(`[INFO] >>> ID : ${message.author.id} | User : ${message.author.tag} | command | ${command.name}`);
    }
};
