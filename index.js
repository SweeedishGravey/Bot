const express = require('express');
const app = express();
const port = 3000;

// Define your routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/data', (req, res) => {
  const data = {
    message: 'This is your API data',
    timestamp: new Date().toISOString()
  };
  res.json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const { config } = require('process');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { token } = require('./config.json');

client.commands = new Collection();

const functions = fs.readdirSync("./Functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./Events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./Commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./Events");
    client.handleCommands(commandFolders, "./Commands");
    client.login(token);
})();