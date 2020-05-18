module.exports = (client, message, box) => {
  // Ignore all bots
  if (message.author.bot) return;

  // See if messages start with the prefix, if not --> messageHandler.js
  if (message.content.toLowerCase().indexOf(client.config.prefix) !== 0) {
    const msg = client.messages.get("messageHandler");
    if (!msg) return;
    msg.run(client, message);

  } else if (message.content.toLowerCase().indexOf(client.config.prefix) == 0) {
    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;

    // Run the command
    cmd.run(client, message, args);
  }

  const color = client.assets.get('changer');
  if (!color) return;

  color.run(client, box);
};