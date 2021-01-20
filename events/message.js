module.exports = (client, message) => {
  // Ignore all bots
  if (message.author.bot) return;

  try {
    // Update the colour of certain roles
    const color = client.resources.get('changer');
    if (!color) return;
    color.run(client);
  } catch (e) {
    console.error(e)
  }

  // See if messages start with the prefix, if not --> messageHandler.js
  if (!message.content.toLowerCase().startsWith(client.config.prefix)) {
    const msg = client.resources.get("mh");
    if (!msg) return;
    msg.run(client, message);

  } else if (message.content.toLowerCase().startsWith(client.config.prefix)) {
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
};