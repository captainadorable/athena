const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    name: 'randomcat',
    aliases: ['rc'],
    description: 'Random cat gif.',
    category: 'Fun',
    cooldown: 5,
    run: async (client, message) => {
        const res = await axios.get('https://api.giphy.com/v1/gifs/random?api_key=UzI7EwlgzuBCAkgF7FyNrFB1s1j2HTU6&limit=1&rating=g&tag=cat');
        const data = res.data.data;
        const embed = new MessageEmbed()
            .setDescription(`[${data.title}](${data.url})`)
            .setImage(data.images.preview_gif.url)
            .setColor(config.color);
        message.channel.send({ embeds: [embed] });
    },
};
