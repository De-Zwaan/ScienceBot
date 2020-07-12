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
    fs.readFile(TOKEN_PATH, (err, content) => {
        if (err) return console.log(`${Date()}\tError loading client secret file: ${err}`);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), quoteGetter);
    });

    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, creds) => {
            if (err || JSON.parse(creds).googleInfo == undefined) return getNewToken(oAuth2Client, callback);
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

    function quoteGetter(auth, args) {
        const sheets = google.sheets({ version: 'v4', auth });
        const Id = '1VMfOyKhksxGLifxPoA58seul2XvvGV7db8-deVYxB4s'

        sheets.spreadsheets.values.get(
            {
                spreadsheetId: Id,
                range: 'Quotes!A2:D', //get the author, quote and date
            },

            function (err, res) {
                if (err) return console.log(`${Date()}\tThe API returned an error: ${err}`);

                quoteProcessor(res.data.values, args);
            }
        );
    }

    function quoteProcessor(data, args) {
        if (args.length <= 0) {

            for (i = 0; i < data.length; i++) {
                if (!data[i][0]) {
                    data.splice(i, 1);
                    i--;
                }
            }

            let result = getRandomQuote(data);

            message.channel.send(`>>> *"${result[0]}"* \n\t\t\t-${result[1]} ${result[2]}`);
            console.log(`${Date()}\tRequested random quote: "${result[0]}"\t-${result[1]} ${result[2]}, for "${message.author.username}"`);

        } else {
            if (args[0] == 'random' || args[0].toLowerCase() == `r`) {
                let result = getRandomQuote(data);

                message.channel.send(`>>> *"${result[0]}"* \n\t\t\t-${result[1]} ${result[2]}`);
                console.log(`${Date()}\tRequested random quote: "${result[0]}"\t-${result[1]} ${result[2]}, for ${message.author.username}`);
            } else if (args[0].toLowerCase() == `list` || args[0].toLowerCase() == `l`) {
                // Display list of all quotes
                listQuotes(data);

            } else if (args[0].toLowerCase() == `search` || args[0].toLowerCase() == `s`) {
                // When the search command is included

                args.shift();

                let lastArg = args[args.length - 1].toLowerCase();

                if (lastArg != `list` && lastArg != `random` && lastArg != `l` && lastArg != `r`) {
                    args.push("random");
                }

                let end = args.length - 1;

                let keywords = args.slice(0, end);

                let found = searchQuotes(keywords, data);

                if (found.length <= 0) {
                    // When no quote containing the keywords was found
                    message.channel.send(`> Couldn't find any quotes containing the keyword(s) **"${keywords.join(`", "`)}"**... Try some other keywords.`);
                    console.log(`${Date()}\tFound no quotes matching: "${keywords.join(`", "`)}", search executed by ${message.author.username}`);

                } else {
                    lastArg = args[end].toLowerCase();

                    if (lastArg == `list` || lastArg == `l`) {
                        // If the user includes "list" on the end of the s!quote command
                        result = listQuotes(found);

                    } else if (lastArg == `random` || lastArg == undefined || lastArg == `r`) {
                        // If the user includes "random" on the end of the s!quote command or does not include a keyword
                        result = getRandomQuote(found);

                        message.channel.send(`>>> *"${result[0]}"* \n\t\t\t-${result[1]} ${result[2]}`);
                        console.log(`${Date()}\tSearched the quotes database using "${keywords.join(`", "`)}", for "${message.author.username}".\n\tFound ${found.length} results. Returned: "${result[0]}" \t-${result[1]} ${result[2]}`);
                    }
                }
            }
        }
    }

    function searchQuotes(keywords, quotes) {
        //message.channel.send("This feature has temporarly been disabled, sorry for the inconvenience.");

        let start = [];

        for (keyword of keywords) {
            // test for every keyword

            for (quote of quotes) {
                // test every quote

                for (prop of quote) {
                    // test for every property

                    if (prop.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
                        start.push(quote)
                    }
                }
            }
        }

        return start;
    }


    function listQuotes(rows) {
        message.channel.send(`> **This feature is not added yet. Soon:tm:**`);
        console.log(`${message.author.username} tried to be sneaky and tried to access the list feature...`);

        // Get the amount of pages
        // Get the page number
        // Get the quotes for that page

        // message.channel.send({
        //     "embed": {
        //         "description": "View the whole spreadsheet with quotes [here](https://docs.google.com/spreadsheets/d/1VMfOyKhksxGLifxPoA58seul2XvvGV7db8-deVYxB4s/edit?usp=sharing).",
        //         "color": 14805148,
        //         "fields": [
        //             {
        //                 "name": "test",
        //                 "value": "test"
        //             },

        //         ],
        //         "footer": {
        //             "text": "Page " + index + " of " + pages.length
        //         },
        //     }
        // })
    }

    function getRandomQuote(rows) {
        let random;
        let quote;
        let date;
        let quoter;
        let result;

        random = Math.floor(Math.random() * rows.length);
        quote = rows[random];

        if (!quote || quote == undefined) {
            result = getRandomQuote(rows);
        }

        quoter = getQuoter(quote);

        date = new Date(quote[3]).getFullYear();

        result = [quote[2], quoter, date]; //;
        // console.log(result);
        return result;
    }

    function getQuoter(quote) {
        quoter = message.guild.members.cache.get(quote[1]);

        if (!quoter) {
            let q = quote[0].split("#")[0].split("@");
            if (q.length <= 1) {
                quoterName = q[0];
            } else {
                quoterName = q[1];
            }
        } else {
            if (quoter.nickname && quoter.nickname != "null") {
                quoterName = quoter.nickname;
            } else if (quoter.user.username != "null") {
                quoterName = quoter.user.username;

            }
        }
        return quoterName;
    }

    message.delete();
}

