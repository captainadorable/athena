const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config.json');

const DefaultEmbed = (props) => {
    const embed = new MessageEmbed();

    try {
        embed.setTitle(props.title || 'Athena');
        embed.setColor(props.color || config.colors.default);
        props.image ? embed.setImage(props.image) : '';
        props.description ? embed.setDescription(props.description) : '';
        if (props.fields) {
            props.fields.forEach((field) => {
                embed.addField(field.title || 'Default', field.description || 'No desc.');
            });
        }
        return embed;
    }
    catch (err) {
        console.log(err);
    }
};

const ErrorEmbed = (props) => {
    const embed = new MessageEmbed();

    try {
        embed.setTitle('Error');
        embed.setColor(config.colors.error);
        embed.setDescription(`${props.error}` || 'An error occured.');
        return embed;
    }
    catch (err) {
        console.log(err);
    }
};

const PagedEmbed = async (props) => {
    const getRow = (id) => {
        const row = new MessageActionRow();

        row.addComponents(
            new MessageButton()
                .setCustomId('prev_embed')
                .setStyle('SECONDARY')
                .setEmoji('⏪')
                .setDisabled(pages[id] === 0),
        );
        row.addComponents(
            new MessageButton()
                .setCustomId('next_embed')
                .setStyle('SECONDARY')
                .setEmoji('⏩')
                .setDisabled(pages[id] === props.embeds.length - 1),
        );
        return row;
    };

    const pages = {};
    pages[props.user.id] = 0;

    const embed = props.embeds[pages[props.user.id]];

    const filter = (i) => i.user.id === props.user.id;
    const time = 1000 * 60 * 5;

    const reply = await props.message.reply({ embeds: [embed], components: [getRow(props.user.id)] });
    const collector = reply.createMessageComponentCollector({ filter, time });

    collector.on('collect', (btnInt) => {
        if (!btnInt) return;

        btnInt.deferUpdate();

        if (btnInt.customId !== 'prev_embed' && btnInt.customId !== 'next_embed') return;

        if (btnInt.customId === 'prev_embed' && pages[props.user.id] > 0) {
            --pages[props.user.id];
        }
        else if (btnInt.customId === 'next_embed' && pages[props.user.id] < props.embeds.length - 1) {
            ++pages[props.user.id];
        }

        reply.edit({
            embeds: [props.embeds[pages[props.user.id]]],
            components: [getRow(props.user.id)],
        });
    });
};

module.exports = { DefaultEmbed, ErrorEmbed, PagedEmbed };
