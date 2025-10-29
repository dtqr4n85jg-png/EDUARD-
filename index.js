require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');

// --- Webserver für Uptime Robot ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Discord Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Webserver läuft auf Port ${PORT} für Uptime Robot`);
});

// --- Discord Bot Setup ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Channel, Partials.Message]
});

client.commands = new Collection();

const DATA_FILE = './data.json';

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const rawData = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(rawData);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
    }
    return { balances: {}, cooldowns: {} };
}

let saveTimeout = null;

function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(client.userData, null, 2));
        console.log('Daten erfolgreich gespeichert');
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
    }
}

function scheduleSave() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
        saveData();
        saveTimeout = null;
    }, 5000);
}

client.userData = loadData();
client.saveData = saveData;
client.scheduleSave = scheduleSave;

setInterval(() => {
    saveData();
}, 60000);

process.on('SIGINT', () => {
    console.log('Bot wird heruntergefahren...');
    saveData();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Bot wird heruntergefahren...');
    saveData();
    process.exit(0);
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name) {
        client.commands.set(command.name, command);
        if (command.aliases) {
            command.aliases.forEach(alias => client.commands.set(alias, command));
        }
    }
}

client.once('ready', () => {
    console.log(`Familien-Manager ist online – erstellt von ${config.BOT_OWNER}`);
    client.user.setActivity('!commands für Hilfe');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.PREFIX)) return;

    if (!config.ALLOWED_SERVERS.includes(message.guild?.id)) return;

    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('Es gab einen Fehler beim Ausführen dieses Befehls!');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!config.ALLOWED_SERVERS.includes(interaction.guild?.id)) return;

    if (interaction.isButton()) {
        const buttonHandlers = {
            'casino_spin': require('./commands/casino'),
            'casino_work': require('./commands/casino'),
            'ticket_beschwerde': require('./commands/ticket'),
            'ticket_support': require('./commands/ticket'),
            'ticket_bewerben': require('./commands/ticket'),
            'close_ticket': require('./commands/ticket'),
            'embed_create': require('./commands/embed'),
            'vorschlag_create': require('./commands/vorschlag'),
        };

        for (const [prefix, handler] of Object.entries(buttonHandlers)) {
            if (interaction.customId.startsWith(prefix.split('_')[0]) || 
                interaction.customId.startsWith(prefix)) {
                await handler.handleButton(interaction, client);
                break;
            }
        }
    }

    if (interaction.isModalSubmit()) {
        const modalHandlers = {
            'vorschlag_modal': require('./commands/vorschlag'),
            'embed_modal': require('./commands/embed'),
            'bewerben_modal': require('./commands/ticket'),
        };

        for (const [modalId, handler] of Object.entries(modalHandlers)) {
            if (interaction.customId === modalId) {
                await handler.handleModal(interaction, client);
                break;
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);