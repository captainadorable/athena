const axios = require('axios');
const EmbedManager = require('../../utils/EmbedManager');

/* Character: used to get all the characters.
    -Get all characters
    -Get a single character
*/
module.exports = {
    name: 'rickandmortywiki',
    aliases: ['rmw'],
    description: 'A rick and morty wiki. Uses rickandmortyapi',
    category: 'Fun',
    cooldown: 5,
    run: async (client, message, args) => {
        const resource = args[0];

        let txt = '';
        args.shift();
        args.forEach(a => txt += a + ' ');
        txt = txt.slice(0, txt.length - 1);
        console.log(`'${txt}'`);

        const resourceArg = txt;

        if (!resourceArg) return;

        if (resource === 'character') {
            if (resourceArg.slice(0, resourceArg.length - (resourceArg.length === 4 ? 1 : 2)) === 'all') {
                const charactersRes = await axios.get(`https://rickandmortyapi.com/api/character/?page=${resourceArg[resourceArg.length - (resourceArg.length === 4 ? 1 : 2)]}`);
                const charactersData = charactersRes.data;

                const characters = [];
                const characterEmbeds = [];
                if (charactersData) {
                    charactersData.results.forEach(character => {
                        characters.push({ name: character.name, status: character.status, species: character.species, gender: character.gender, location: character.location.name, image: character.image, episodes: character.episode.map(episode => episode.split('/')[5]) });
                    });
                    characters.forEach(character => {
                        let eptext = '| ';
                        character.episodes.forEach(ep => eptext += '``' + ep + '`` | ');
                        const fields = [
                            { title: 'Name', description: character.name },
                            { title: 'Status', description: character.status },
                            { title: 'Species', description: character.species },
                            { title: 'Gender', description: character.gender },
                            { title: 'Location', description: character.location },
                            { title: 'Episodes', description: eptext },
                        ];
                        const embed = EmbedManager.DefaultEmbed({ title: 'Rick And Morty Wiki', fields, image: character.image });

                        characterEmbeds.push(embed);
                    });

                    EmbedManager.PagedEmbed({ user: message.author, embeds: characterEmbeds, message });
                }
                else {
                    EmbedManager.ErrorEmbed({ error: 'Character data not found!' });
                }
            }
            else {
                const charactersRes = await axios.get('https://rickandmortyapi.com/api/character');
                const charactersData = charactersRes.data;

                const foundCharacter = charactersData.results.find(char => char.name === resourceArg);

                if (foundCharacter) {
                    const character = { name: foundCharacter.name, status: foundCharacter.status, species: foundCharacter.species, gender: foundCharacter.gender, location: foundCharacter.location.name, image: foundCharacter.image, episodes: foundCharacter.episode.map(episode => episode.split('/')[5]) };

                    let eptext = '| ';
                    character.episodes.forEach(ep => eptext += '``' + ep + '`` | ');
                    const fields = [
                        { title: 'Name', description: character.name },
                        { title: 'Status', description: character.status },
                        { title: 'Species', description: character.species },
                        { title: 'Gender', description: character.gender },
                        { title: 'Location', description: character.location },
                        { title: 'Episodes', description: eptext },
                    ];
                    const embed = EmbedManager.DefaultEmbed({ title: 'Rick And Morty Wiki', fields, image: foundCharacter.image });
                    message.reply({ embeds: [embed] });
                }
                else {
                    message.reply({ embeds: [EmbedManager.ErrorEmbed({ error: 'Character data not found!' })] });
                }
            }
        }
        // else if (resource === 'location')
        else if (resource === 'episode') {
            if (resourceArg === 'all') {

            }
            else {

            }
        }
        else {
            return message.reply({ embeds: [EmbedManager.ErrorEmbed({ error: 'Command used wrong! **ath!rickandmortywiki <character, location, episode> <all, [specific]>**' })] });
        }
    },
};
