exports.run = (client, message) => {
  let fs = require("fs");
  let messageLowerCase = message.content.toLowerCase();

  //console.log(message.content);
  
  // Cussing Bot
  for (word of client.box.swearWords) {
    if (messageLowerCase.search(word) >= 0) {
      console.log(`Found "${word}" in "${message.content}" sent by "${message.author.username}".`);
      message.react('❌');
      break;
    }
  }

  if (message.content == `<@234293993033170944>` || message.content == (`<@!234293993033170944>`)) {
    message.channel.send(`"Hey stop that" - TheBlackCat 2018`);
    console.log(`Responded with "Hey stop that" - TheBlackCat 2018 to "${message.author.username}".`);
  }

  if (message.content.search(client.config.ownerID) >= 0 || message.content.search(client.config.BotClientID) >= 0) { //NO U command
    if (message.author.bot) return;
    message.reply(' NO U!');
    console.log(`Replied "NO U!" to "${message.author.username}".`);
  }
}