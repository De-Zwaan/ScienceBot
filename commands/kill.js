exports.run = (client, message, [mention, ...reason]) => {                         //Kill command
    message.channel.send(`Killed ${message.author} for ya!`);
    message.channel.send('Oh, I wasn`t supposed to kill you?');
    console.log(`killed ${message.author} at ${Date()}`)
};
