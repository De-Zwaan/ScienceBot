exports.run = (client, message, args) => {
  message.channel.send('Pinging...').then(function(m) {
    let ping = m.createdTimestamp - message.createdTimestamp;
    m.edit('Pong! It took ' + ping + 'ms!');
    console.log(`The ping was ${ping}ms.`)
  })
}
