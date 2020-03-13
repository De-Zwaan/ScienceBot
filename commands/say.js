exports.run = (client, message, args) => {       //say command
    let text = args.slice(0).join(" ");
    message.delete();

    if (message.author.id == client.config.ownerID) {
      message.channel.send(`> ${text}`);
    } else {
      message.channel.send(`> You want me to say ${text}? I am not going to say ${text}, that sounds stupid...`);
      console.log(`${Date()}\tSaid ${text} for ${message.author}`);
    }
}
