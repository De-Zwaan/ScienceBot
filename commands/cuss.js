exports.run = (client, message, args) => {
  let fs = require("fs");

  // Test if there are enough arguments to complete the command
  if (!args || args.size < 2 || args == null) return message.channel.send(`> You must provide Cussword to add...`);

  // Test if the argument 'add' id provided
  if (args[0].toLowerCase() == 'add') {

    // Test if the owner of the bot used the command
    if (message.author.id != client.config.ownerID) return;

    // Read the box.json file
    fs.readFile('./box.json', `utf-8`, function (err, data) {
      if (err) throw err;

      // Parse the data from box.json
      let box = JSON.parse(data);

      // Check if the word provided is already part of the filter
      if (box.swearWords.indexOf(args[1]) > 0) {
        message.channel.send(`> "${args[1]}" is already in the cussing filter...`);
        return;
      }

      // Push the new cussword on the list with box
      box.swearWords.push(
        args[1].toLowerCase()
      );

      // Save the file with the new cussword
      fs.writeFile('./box.json', JSON.stringify(box), `utf-8`, function (err) {
        if (err) throw err;
      })

      // Message the console and user about the change
      message.channel.send(`> Added "${args[1]}" to the cussing filter...`);
      console.log(`${Date()}\tAdded "${args[1]}" to the cussing filter...`);
    });

  // Test if the argument 'remove' is used
  } else if (args[0].toLowerCase() == 'remove') {

    // Test if the owner of the bot used the command
    if (message.author.id != client.config.ownerID) return;

    // Read the box.json file
    fs.readFile('./box.json', `utf-8`, function (err, data) {
      if (err) throw err;

      // Parse the data from box.json
      let box = JSON.parse(data);

      // Store the location of the cussword
      let cussPos = box.swearWords.indexOf(args[1]);

      // Check if the word provided is part of the filter
      if (cussPos < 0) {
        return;
      }

      // Remove the cussword from the list
      box.swearWords.splice(cussPos, 1);

      // Save the file with the new cussword
      fs.writeFile(`./box.json`, JSON.stringify(box), `utf-8`, function (err) {
        if (err) throw err;
      })      

      // Message the console and user about the change
      message.channel.send(`> Removed "${args[1]}" from the cussing filter...`);
      console.log(`${Date()}\tRemoved "${args[1]}" from the cussing filter...`);
    })

  // Test if the argument 'list' is used
  } else if (args[0].toLowerCase() == "list") {

    // Read the box.json file
    fs.readFile(`./box.json`, `utf-8`, function (err, data) {
      if (err) throw err;

      // Parse the data from box.json
      let box = JSON.parse(data);

      // Create a string from the array
      let cussString = box.swearWords.join("\n\t");
      
      // Message the console and user about the list
      message.channel.send(`>>> Here is a list of cussing words:\n\t${cussString}\n I hope you typed this in #nsfw...`);
      console.log(`${Date()}\tHere is a list of cussing words:\n\t${cussString}`);
    });
  }

  // Remove the command message from the channel
  message.delete();
}
