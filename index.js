const { Client, Sweepers, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    allowedMentions: {
        parse: ['users'],
        repliedUser: true,
    },
    cacheWithLimits: {
        // Buna bi bak aq bune
        MessageManager: {
            sweepInterval: 300,
            sweepFilter: Sweepers.filterByLifetime({
                lifetime: 60,
                getComparisonTimestamp: (m) => m.editedTimestamp ?? m.createdTimestamp,
            }),
        },
    },
});

client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();

['commands', 'events'].forEach((handler) => {
    require(`./handlers/${handler}`)(client);
});

client.login(token);
