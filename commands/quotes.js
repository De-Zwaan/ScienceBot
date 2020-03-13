exports.run = (client, message, args) => {

    if (args == undefined) {
        args = [];
    }

    const fs = require('fs');
    const readline = require('readline');
    const { google } = require('googleapis');

    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

    const TOKEN_PATH = 'token.json';

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), infoGetter);
    });

    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, args);
        });
    }

    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client, args);
            });
        });
    }

    function infoGetter(auth, args) {
        const sheets = google.sheets({ version: 'v4', auth });
        const Id = '1VMfOyKhksxGLifxPoA58seul2XvvGV7db8-deVYxB4s'

        sheets.spreadsheets.values.get(
            {
                spreadsheetId: Id,
                range: 'Users!A2:D', //get the user, userId, quoted and quotes
            },

            function (err, res) {
                if (err) return console.log('The API returned an error: ' + err);

                findUser(res.data.values, args);
            }
        );
    }
    
    function findUser(data, args) {
        let user;

        if (args.length <= 0) {
            try {
                user = message.guild.members.find(member => member.id == message.author.id);
            } catch (error) {
                user = null;
            }

        } else if (message.mentions.users.array().length >= 1) {
            try {
                user = message.guild.members.find(member => member.id == message.mentions.users.first().id);
            } catch (error) {
                user = null;
            }

        } else {
            try {
                user = message.guild.members.find(member => (member.displayName == args[0] || member.username == args[0] || member.id == args[0]));
            } catch (error) {
                user = null;
            }

        }

        if (user === null) {
            message.channel.send(`> Please provide a valid username`) 
            // console.log(message.mentions.users.first())
            return;
        }

        try {
            quoted = data.find(tempUser => tempUser[1] == `${user.id}`)[2];
            quotes = data.find(tempUser => tempUser[1] == `${user.id}`)[3];
        } catch (error) {
            console.error(error);
            message.channel.send(`> It seems like ${user.displayName} has not yet been quoted.`)
        }
        

        // console.log(`quoted:\t${quoted}\nquotes:\t${quotes}`)
        message.channel.send(`>>> **${user.displayName}**:\n\tQuoted:\t${quoted}\n\tQuotes:\t${quotes}`)
    }

    message.delete();
}