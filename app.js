const Enmap = require("enmap");
const fs = require("fs");
const readline = require("readline");

const Discord = require('discord.js');

// Discord Client
const client = new Discord.Client();

const config = require("./config.json");
const box = require("./box.json");

// Attach config.json and box.json to the client
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
    process.stdout.write(`Attempting to load "${client.config.prefix}${commandName}"\r`);
    client.commands.set(commandName, props);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Loaded "${client.config.prefix}${commandName}"\n`);
  })
});

// Resources
client.resources = new Enmap();

/**
 * function to preload the resources that are not events or commands into memory and attach them to the client
 * 
 * @param {String} name the name of the resource to be displayed in the logs
 * @param {String} abbr the abbreviation of the name to be used as the name in the enmap
 * @param {String} location the path to the file with the resource
 */
function loadResource(name, abbr, location) {
  const service = require(location);

  process.stdout.write(`Attempting to load ${name}\r`);
  client.resources.set(abbr.toLowerCase(), service);
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`Loaded ${name}\n`);
}

//Execute the preloading
// Rich Presence
loadResource('Rich Precence',   'RPC',      './assets/rpc.js');
// Message handler
loadResource('Message Handler', 'MH',       './messages/messageHandler.js');
// Changing role
loadResource('Color Changer',   'changer',  './assets/changer.js');

// Discord client
client.login(client.config.token);
