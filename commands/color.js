exports.run = (client, message, [r, g, b]) => {
    if (message.author.id != client.config.ownerID) return message.channel.send("You're **not** allowed to do that!");

    let color = argsToRGB(r, g, b);

    if (color.r < 0x00 || color.r > 0xff || color.g < 0x00 || color.g > 0xff || color.b < 0x00 || color.b > 0xff) return message.channel.send("That is not a valid RGB code.");

    let guilds = [
        Test = {
            guildID: 500671784627208205,
            roleID: 535551545190907914
        },
        TGS = {
            guildID: 436144798462771200,
            roleID: 593892108700745731
        }]

    for (guild of guilds) {
        changeColor(color, guild.guildID, guild.roleID)
    }

    function argsToRGB(r, g, b) {
        let rVal = parseInt(r, 10);
        let gVal = parseInt(g, 10);
        let bVal = parseInt(b, 10);
        return new Color(rVal, gVal, bVal);
    }

    function changeColor(c, guildID, roleID) {
        let printR = c.r < 16 ? "0" + c.r.toString(16) : c.r.toString(16);
        let printG = c.g < 16 ? "0" + c.g.toString(16) : c.g.toString(16);
        let printB = c.b < 16 ? "0" + c.b.toString(16) : c.b.toString(16);

        guild = client.guilds.find(guild => guild.id == guildID).roles.find(role => role.id == roleID);
        guild.setColor([c.r, c.g, c.b]).catch(function (err) {
            if (err) throw err;
        });

        console.log(`${Date()}\tSet color in ${client.guilds.find(guild => guild.id == guildID).name} to #${printR}${printG}${printB}.`);
    }

    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    message.delete();
};
