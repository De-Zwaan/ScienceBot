exports.run = (client, message, args) => {
  message.channel.send('> Pinging...').then(function(m) {
    let ping = m.createdTimestamp - message.createdTimestamp;
    m.edit('>>> Pong!\nIt took ' + ping + 'ms!');
    console.log(`${Date()}\tThe ping was ${ping}ms.`);
  })
  message.delete();
}
