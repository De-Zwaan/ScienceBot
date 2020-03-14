exports.run = (client, message, args) => {
  let fs = require("fs");

  if (!args || args.size < 2 || args == null) return message.channel.send(`> You must provide Cussword to add...`);
  if (args[0].toLowerCase() == 'add') {
    if (message.author.id != client.config.ownerID) return;
    fs.readFile('./box.json', `utf-8`, function (err, data) {
      if (err) throw err;

      let cussWords = JSON.parse(data);

      if (cussWords.swearWords.indexOf(args[1]) > 0) return;

      cussWords.swearWords.push(
        args[1].toLowerCase()
      );

      fs.writeFile('./box.json', JSON.stringify(cussWords), `utf-8`, function (err) {
        if (err) throw err;
      })
      message.channel.send(`> Added "${args[1]}" to the cussing filter...`);
      console.log(`${Date()}\tAdded "${args[1]}" to the cussing filter...`);
    });

  } else if (args[0].toLowerCase() == 'remove') {
    if (message.author.id != client.config.ownerID) return;
    fs.readFile('./box.json', `utf-8`, function (err, data) {
      if (err) throw err;

      let cussWords = JSON.parse(data);

      if (cussWords.swearWords.indexOf(args[1]) < 0) return;

      let cussPos = cussWords.swearWords.indexOf(args[1]);

      cussWords.swearWords.splice(cussPos, 1);

      fs.writeFile(`./box.json`, JSON.stringify(cussWords), `utf-8`, function (err) {
        if (err) throw err;
      })
      message.channel.send(`> Removed "${args[1]}" from the cussing filter...`);
      console.log(`${Date()}\tRemoved "${args[1]}" from the cussing filter...`);
    })
  } else if (args[0].toLowerCase() == "list") {
    fs.readFile(`./box.json`, `utf-8`, function (err, data) {
      if (err) throw err;
      let cussWords = JSON.parse(data);
      let cussString = cussWords.swearWords.join("\n\t");
      message.channel.send(`>>> Here is a list of cussing words:\n\t${cussString}\n I hope you typed this in #nsfw...`);
      console.log(`${Date()}\tHere is a list of cussing words:\n\t${cussString}`);
    });
  }
  message.delete();
}
