exports.run = (client, message, [r, g, b]) => {
    if(message.author.id != client.config.ownerID) return message.channel.send("You're **not** allowed to do that!");
    
    let color = argsToRGB(r, g, b);   

    if(color.r < 0x00 || color.r > 0xff || color.g < 0x00 || color.g > 0xff || color.b < 0x00 || color.b > 0xff) return message.channel.send("That is not a valid RGB code.");

    TGSRole = client.guilds.find(guild => guild.id == 436144798462771200).roles.find(role => role.id == 593892108700745731);
    TGSRole.setColor()

    TESTRole = client.guilds.find(guild => guild.id == 500671784627208205).roles.find(role => role.id == 535551545190907914);
    TESTRole.setColor()
};

function argsToRGB(r, g, b) {
    let rVal = parseInt(r, 10);
    let gVal = parseInt(g, 10);
    let bVal = parseInt(b, 10);
    return new Color(rVal, gVal, bVal);
}

function changeColor(r, g, b, guild) {
    guild.setColor()
}

let Color = function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}
  