const logger = require('../Utilities/logger')

module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        const eventsLoaded = eventFiles.length; // Get the number of events loaded

        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => {
                    event.execute(...args, client);
                });
            } else {
                client.on(event.name, (...args) => {
                    event.execute(...args, client);
                });
            }
        }
        logger.info('Api', `Loaded ${eventsLoaded} events.`); // Display the total number of events loaded
    };
}