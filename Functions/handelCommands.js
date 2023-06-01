const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { token } = require('../config.json');
const logger = require('../Utilities/logger')

const clientId = '1099516592120938496';
const guildId = '1090103670990966866';

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        let commandsLoaded = 0; // Initialize commandsLoaded counter

        logger.info('client', 'Started refreshing application (/) commands.'); // Log the start message

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
                commandsLoaded++; // Increment commandsLoaded for each loaded command
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(token);

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                logger.info('client', 'Successfully reloaded application (/) commands.'); // Log the success message
                logger.info('Api', `Loaded ${commandsLoaded} commands.`); // Display the total number of commands loaded
            } catch (error) {
                console.error(error);
            }
        })();
    };
};