exports.run = (client, message, [mention, ...reason]) => {                         //Kill command
    message.channel.send(`>>> I Killed *${message.author.username}** for ya!\nOh, I wasn't supposed to kill you?`);
    console.log(`${Date()}\tkilled ${message.author.username}`);
    message.delete();
};
