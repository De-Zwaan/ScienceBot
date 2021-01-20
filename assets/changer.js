exports.run = (client) => {
    const fs = require("fs");
    const boxPath = `./box.json`

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

    function changeColour(newRolecolour) {
        // Create hex code for console log
        let printR = newRolecolour.r < 16 ? "0" + newRolecolour.r.toString(16) : newRolecolour.r.toString(16);
        let printG = newRolecolour.g < 16 ? "0" + newRolecolour.g.toString(16) : newRolecolour.g.toString(16);
        let printB = newRolecolour.b < 16 ? "0" + newRolecolour.b.toString(16) : newRolecolour.b.toString(16);

        let guilds = Object.keys(client.config.guilds);

        guilds.forEach((guild) => {
            let serverID = client.config.guilds[guild].serverID
            let roleID = client.config.guilds[guild].colourChangingRoleID

            // Getting the path to the role of the user
            role = client.guilds.cache.find(guild => guild.id == serverID).roles.cache.find(role => role.id == roleID)

            // Changing the colour of the role
            role.setColor([newRolecolour.r, newRolecolour.g, newRolecolour.b]).catch(function (err) {
                if (err) throw err;
            });

            // Log the event
            console.log(`${Date()}\tSet colour in ${client.guilds.cache.find(guild => guild.id == serverID).name} to #${printR}${printG}${printB}.`);
        });
    }

    // Get the last logged time from the box
    let Time = client.box.date;

    // Getting the current date
    let currentDate = new Date();

    let dayOfYear = getDayOfYear(currentDate);

    // If the date in box.json was the same, return
    if (Time == `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`) return;

    // Setting up the new colour
    let newRolecolour = new Colour(map(dayOfYear, 1, 365, 0, 1), 0.7, 0.5);

    function Colour(h, s, l) {
        let colour = hslToRgb(h, s, l);
        this.r = Math.round(colour[0]);
        this.g = Math.round(colour[1]);
        this.b = Math.round(colour[2]);
    }

    // Change the colour to the newRoleColour
    changeColour(newRolecolour);


    // Setting the current date in box.json
    client.box.date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    // Log the current time
    fs.writeFile(boxPath, JSON.stringify(client.box), `utf-8`, function (err) {
        if (err) throw err;
    });
};