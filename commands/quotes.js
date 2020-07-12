exports.run = (client, message, args) => {

    if (args == undefined) {
        args = [];
    }

    const fs = require('fs');
    const readline = require('readline');
    const { google } = require('googleapis');

    // If modifying these scopes, delete config.json.
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

    const TOKEN_PATH = 'config.json';

    // Load client secrets from a local file.
    fs.readFile('config.json', (err, content) => {
        if (err) return console.log(`${Date()}\tError loading client secret file: ${err}`);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), infoGetter);
    });

    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, creds) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(creds).googleInfo);
            callback(oAuth2Client, args);
        });
    }

    function getNewToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log(`${Date()}\tAuthorize this app by visiting this url: ${authUrl}`);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error(`${Date()}\tError while trying to retrieve access token ${err}`);
                oAuth2Client.setCredentials(token);

                // Get other credentials from the file before overwriting it 
                fs.readFile(TOKEN_PATH, 'utf-8', function (err, oldCreds) {
                    if (err) throw err;

                    // Parse the creds
                    let creds = JSON.parse(oldCreds)
                    
                    // Change the value of googleInfo to the new token
                    creds.googleInfo = token;
                    
                    // Store the creds back to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(creds), (err) => {
                        if (err) console.error(err);
                        console.log(`${Date()}\tToken stored to: ${TOKEN_PATH}`);
                    });
                })
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
    
    /**
     * Function to find a user if mentioned 
     *  
     * @param {Array} args array with the arguments given with the command
     * 
     * @callback sendResults() function that returns the results
     */
    function findUser(args) {
        // Initialise an empty variable to store the user
        let user;

        // If there is no user mentioned, use the user executing the command
        if (args.length <= 0) {
            try {
                user = message.guild.members.cache.find(member => member.id == message.author.id);
            } catch (error) {
                user = null;
            }

            // If a user is mentioned, use the first user in the list (Random?)
        } else if (message.mentions.users.array().length >= 1) {
            try {
                user = message.guild.members.cache.find(member => member.id == message.mentions.users.first().id);
            } catch (error) {
                user = null;
            }

            // If there is an argument, but it isn't a mention, try to find a user matching that argument
        } else {
            try {
                user = message.guild.members.cache.find(member => (member.displayName == args[0] || member.username == args[0] || member.id == args[0]));
            } catch (error) {
                user = null;
            }

        }


    /**
     * Function to get the information from the spreadsheet
     * 
     * @param {array} data a multidimentional array with the data from the spreadsheet
     * @param {Array} args array with the arguments given with the command
     * 
     * @returns {Array}
     */
            message.channel.send(`> Please provide a valid username`) 
            // console.log(message.mentions.users.first())
            return;
        }

    /**
     * Function to send a message in the same channel as the command with the information from the spreadsheet
     * 
     * @param {array} data a multidimentional array with the data from the spreadsheet
     * @param {Array} args array with the arguments given with the command
     */
    function sendMessage(data, args) {
        try {
            quoted = data.find(tempUser => tempUser[1] == `${user.id}`)[2];
            quotes = data.find(tempUser => tempUser[1] == `${user.id}`)[3];
        } catch (error) {
            console.error(error);
            message.channel.send(`> It seems like ${user.displayName} has not yet been quoted.`);
            return;
        }
        

        console.log(`${Date()}\tReturned the amount of quotes/quoted for ${user.displayName}.`);
        message.channel.send(`>>> **${user.displayName}**:\n\tQuoted:\t${quoted}\n\tQuotes:\t${quotes}`)
    }

    // Delete the message calling the command
    message.delete();
}