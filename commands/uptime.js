exports.run = (client, message, args) => {
    // Find the time that the bot started at and the current time
    let start = new Date(client.readyAt);
    let current = new Date();

    // Get the difference
    let diffence = current - start;

    // Convert the diffence in minutes, hours and days
    let minutes = new Date(diffence).getMinutes();
    let hours = new Date(diffence).getHours();
    let days = Math.floor((diffence) / (1000 * 3600 * 24));

    // Send the result 
    message.channel.send(`>>> The bot has been up for: \n\t*${days} days, ${hours} hours and ${minutes} minutes*`)
    console.log(`${Date()}\tThe bot has been up for: ${days} days, ${hours} hours and ${minutes} minutes`);

    // Delete the original message
    message.delete();
};
