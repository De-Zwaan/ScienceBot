module.exports = (client, box) => {
    const fs = require("fs");
    const boxPath = `../box.json`

    // Maps values to new values
    function map(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    // Get the day of the year
    function getDayOfYear(now) {
        // Get the start of the year
        let startOfYear = new Date(now.getFullYear(), 0, 1, 1);

        // Get the amount of ms per day
        let msPerDay = new Date(1970, 0, 2, 1, 0, 0, 0).getTime();

        // Get the day of the year
        let currentDayOfYear = Math.floor((now - startOfYear) / msPerDay);

        return currentDayOfYear
    }

    // Reading the last time the color has changed form box.json
    fs.readFile(boxPath, `utf-8`, function (err, data) {
        if (err) throw err;

        let box = JSON.parse(data);

        let Time = box.date;

        // Getting the current date
        let currentDate = new Date();

        let dayOfYear = getDayOfYear(currentDate);

        // If the date in box.json was the same, return
        if (Time == `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`) return;

        // Setting up the new color
        let newRoleColor = new Color(map(dayOfYear, 1, 365, 0, 1), 0.7, 0.5);

        function Color(h, s, l) {
            let color = hslToRgb(h, s, l);
            this.r = Math.round(color[0]);
            this.g = Math.round(color[1]);
            this.b = Math.round(color[2]);
        }

        // https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion 
        function hslToRgb(h, s, l) {
            let r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        // Setting the current date in box.json
        box.date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        let printR = newRoleColor.r < 16 ? "0" + newRoleColor.r.toString(16) : newRoleColor.r.toString(16);
        let printG = newRoleColor.g < 16 ? "0" + newRoleColor.g.toString(16) : newRoleColor.g.toString(16);
        let printB = newRoleColor.b < 16 ? "0" + newRoleColor.b.toString(16) : newRoleColor.b.toString(16);

        // Getting the path to the role of the user
        TESTRole = client.guilds.find(guild => guild.id == 500671784627208205).roles.find(role => role.id == 535551545190907914)
        // Changing the color of the role
        TESTRole.setColor([newRoleColor.r, newRoleColor.g, newRoleColor.b]).catch(function (err) {
            if (err) throw err;
        });
        console.log(`Set color in ${client.guilds.find(guild => guild.id == 500671784627208205).name} to #${printR}${printG}${printB}, at ${currentDate}.`);

        // Getting the path to the role of the user
        TGSRole = client.guilds.find(guild => guild.id == 436144798462771200).roles.find(role => role.id == 593892108700745731)
        // Changing the color of the role
        TGSRole.setColor([newRoleColor.r, newRoleColor.g, newRoleColor.b]).catch(function (err) {
            if (err) throw err;
        });
        console.log(`Set color in ${client.guilds.find(guild => guild.id == 436144798462771200).name} to #${printR}${printG}${printB}, at ${currentDate}.`);

        // Writing everything to box.json
        fs.writeFile(boxPath, JSON.stringify(box), `utf-8`, function (err) {
            if (err) throw err;
        });
    });
};