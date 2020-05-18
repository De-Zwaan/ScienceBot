exports.run = (client, message, args) => {       //say command
  if (message.author.id == client.config.ownerID) {
    message.channel.send(`> Stopping...`);
    message.delete();
    console.log(`${Date()}\tStopped at ${Date()} by ${message.author}`);
    setTimeout(function stop() {process.exit(0)}, 1000);
  } else {
    message.channel.send(`> You Can't Stop Me Now, 'Cause we're having a good time...`);
  }
}
