const Discord = require("discord.js");

const Enmap = require("enmap");
const fs = require("fs");

// Discord Client
const client = new Discord.Client();

const config = require("./config.json");
const box = require("./box.json");

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;
client.box = box;

// Events
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

// Commands
client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load the command "${commandName}".`);
    client.commands.set(commandName, props);
  });
});

// Rich Presence 
client.RichPresence = new Enmap();
const RPC = require('./rpc.js');

console.log('Attempting to load Rich Presence.');
client.RichPresence.set('rpc', RPC);

// Message handler
client.messages = new Enmap();
const MH = require('./messages/messageHandler.js');

console.log(`Attempting to load the messageHandler.`);
client.messages.set('messageHandler', MH);

// Changing role
client.assets = new Enmap();
const changer = require('./assets/changer.js');

console.log(`Attempting to load the color changer.`);
client.assets.set('changer', changer);

// Discord client
client.login(client.config.token);
