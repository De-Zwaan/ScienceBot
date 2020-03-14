module.exports = (client) => {
  // Setting playing status:
  changeStatus()

  async function changeStatus() {
    client.user.setPresence({
      status: 'idle',
      game: {
        name: 'Experiments!',
        type: 3,
        url: 'https://www.wikipedia.org/'
      }
    });
  }

  // Logging ready message:
  console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users, as ${client.user.tag}!`);

  // Running RPC Client

  const rpc = client.RichPresence.get('rpc');

  if (!rpc) return;

  rpc.run(client);
}