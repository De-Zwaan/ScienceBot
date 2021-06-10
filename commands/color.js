exports.run = (client, message, [r, g, b]) => {
    if (message.author.id != client.config.ownerID) return message.channel.send("You're **not** allowed to do that!");

    let color = argsToRGB(r, g, b);

    if (color.r < 0x00 || color.r > 0xff || color.g < 0x00 || color.g > 0xff || color.b < 0x00 || color.b > 0xff) return message.channel.send("That is not a valid RGB code.");

    function argsToRGB(r, g, b) {
        let rVal = parseInt(r, 10);
        let gVal = parseInt(g, 10);
        let bVal = parseInt(b, 10);
        return new Color(rVal, gVal, bVal);
    }
    
    // Color object
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    function changeColour(newRolecolour, guild) {
        if (guild < 0) console.error('Invalid guild');
        let serverID = client.config.guilds[guild].serverID
        let roleID = client.config.guilds[guild].colourChangingRoleID
        
        // Getting the path to the role of the user
        role = client.guilds.cache.find(guild => guild.id == serverID).roles.cache.find(role => role.id == roleID);
        
        // Changing the colour of the role
        role.setColor([newRolecolour.r, newRolecolour.g, newRolecolour.b]).catch(function (err) {
            if (err) throw err;
        });
        
        // Create hex code for console log
        let printR = newRolecolour.r < 16 ? "0" + newRolecolour.r.toString(16) : newRolecolour.r.toString(16);
        let printG = newRolecolour.g < 16 ? "0" + newRolecolour.g.toString(16) : newRolecolour.g.toString(16);
        let printB = newRolecolour.b < 16 ? "0" + newRolecolour.b.toString(16) : newRolecolour.b.toString(16);
        // Log the event
        console.log(`${Date()}\tSet colour in ${client.guilds.cache.find(guild => guild.id == serverID).name} to #${printR}${printG}${printB}.`);
    }

    const guilds = Object.keys(client.config.guilds);
    console.log(guilds);

    let guild;
    try {
        guild = guilds.find(server => server.serverID == message.guild.id);
    } catch (err) {
        guild = -1;
        console.error(err)
    } 
    
    changeColour(color, guild);

    message.delete();
};
