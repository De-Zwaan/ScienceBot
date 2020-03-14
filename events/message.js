module.exports = (client, message, box) => {
  const fs = require("fs");

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

  //--- Color changing role -----------------------------------------------------------------

  // Setting up the map function
  function map(value, low1, high1, low2, high2) { 
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  // Reading the last time the color has changed form box.json
  fs.readFile(`./box.json`, `utf-8`, function (err, data) {
    if (err) throw err;

    let box = JSON.parse(data);

    let Time = box.date;

    // Getting the current date
    let currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();

    // If the date in box.json was the same, return
    if (Time == `${day}-${month}-${year}`) return;

    // Setting up the new color
    let newRoleColor = new Color(map(day, 1, 31, 0, 255), map(month, 1, 12, 0, 255) + map(day, 1, 31, 0, 1), map(year, 2000, 2050, 0, 255) + map(month, 1, 12, 0, 1));

    function Color(red, green, blue) {
      this.r = Math.round(red);
      this.g = Math.round(green);
      this.b = Math.round(blue);
    }

    // Setting the current date in box.json
    box.date = `${day}-${month}-${year}`;

    // Getting the path to the role of the user
    role = client.guilds.find(guild => guild.name === "T.E.S.T").roles.find(role => role.name === "Swan-Color")
    
    // Changing the color of the role
    role.setColor([newRoleColor.r, newRoleColor.g, newRoleColor.b]).catch(function (err) {
      if (err) throw err;
    });

    // Logging the change
    console.log(`Set color in ${client.guilds.find(guild => guild.name === "T.E.S.T")} to ${newRoleColor.r}R, ${newRoleColor.g}G, ${newRoleColor.b}B. at ${currentDate}.`);

    // Writing everything to box.json
    fs.writeFile(`./box.json`, JSON.stringify(box), `utf-8`, function (err) {
      if (err) throw err;
    });
  });
};