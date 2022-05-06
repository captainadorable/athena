const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    name: 'quran',
    aliases: [],
    description: 'Muhhamed has something he wants to tell you.',
    category: 'Fun',
    cooldown: 5,
    run: async (client, message, args) => {
        const surah = args[0];
        const number = args[1];

        let embed = new MessageEmbed()
            .setTitle('Error')
            .setDescription('Command used wrong. >>> ath!quran <surah> <number>')
            .setColor(config.color);
        if (!surah || !number || isNaN(parseInt(number))) return message.reply({ embeds: [embed] });

        try {
            let res = await axios.get('https://api.acikkuran.com/surahs');
            const foundSurah = res.data.data.find((srh) => srh.slug === surah.toLowerCase());

            const surahNotFoundEmbed = new MessageEmbed().setTitle('Error').setDescription('Surah not found.').setColor(config.color);
            if (!foundSurah) return message.reply({ embeds: [surahNotFoundEmbed] });

            res = await axios.get(`https://api.acikkuran.com/surah/${foundSurah.id}/verse/${number}`);

            if (!res.data) return message.reply({ embeds: [surahNotFoundEmbed] });
            const data = res.data.data;

            let footnotestext = '';
            if (data.translation.footnotes) {
                data.translation.footnotes.forEach(note => {
                    footnotestext += `[${note.number}]: ${note.text}\n\n`;
                });
            }
            else {
                footnotestext = 'No footnotes';
            }

            embed = new MessageEmbed()
                .setTitle(`${data.surah.name} | ${number}`)
                .addField('Original', '```' + data.verse_without_vowel + '```')
                .addField('Translation', '```' + data.translation.text + '```')
                .addField('Footnotes', footnotestext)
                .setFooter({ text: 'Translator: ' + data.translation.author.name })
                .setColor(config.color);
            message.reply({ embeds: [embed] });
        }
        catch (err) {
            embed = new MessageEmbed().setTitle('Error').setDescription(`${err}`).setColor(config.color);
            message.reply({ embeds: [embed] });
            console.log(err);
        }
    },
};
