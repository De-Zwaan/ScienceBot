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
  console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users, as ${client.user.tag}!`);

  // Running RPC Client
  const rpc = client.resources.get('rpc');

  if (!rpc) return;

  // rpc.run(client);
}