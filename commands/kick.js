exports.run = (client, message, [mention, ...reason]) => {
  /*const modRole = message.guild.roles.find("name", "Mods");
  if (!modRole)
    return console.log("The Mods role does not exist");

  if (!message.member.roles.has(modRole.id))
    return message.channel.send("You can't use this command.");

  if (message.mentions.members.size === 0)
    return message.channel.send("Please mention a user to kick");

  if (!message.guild.me.hasPermission("KICK_MEMBERS"))
    return message.channel.send("");

  const kickMember = message.mentions.members.first();

  kickMember.kick(reason.join(" ")).then(member => {
    message.channel.send(`${member.user.username} was succesfully kicked.`);
  });*/
};
