const discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'avatar',
    aliases: [],
    description: 'Get mentioned user\'s avatar.',
    category: 'Misc',
    cooldown: 5,
    run: async (client, message) => {
        const user = message.mentions.users.first() || message.author;
        const embed = new discord.MessageEmbed().setTitle(`${user.username}'s avatar`).setImage(user.avatarURL({ dynamic: true, size: 4096 })).setColor(config.color);
        await message.reply({ embeds: [embed] });
    },
};
