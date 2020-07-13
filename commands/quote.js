exports.run = (client, message, args) => {

    // If there are no useful arguments given set args to an empty array
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
        authorize(JSON.parse(content), quoteGetter);
    });

    /** 
     * Authorize the client to read the spreadsheet
     * 
     * @param {Object} credentials the credentials in config.json
     * @param {CallableFunction} callback the function to be called after completing authorisation
     * 
     * @callback callback start quoteGetter
     */
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

    /**
     * If there is no token found, get a new token
     * 
     * @param {oAuth2Client} oAuth2Client
     * @param {CallableFunction} callback the function to call after
     */
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

    /** 
     * Get all the quotes from the spreadsheet
     * 
     * @param {oAuth2Client} auth the authorisation object
     * @param {Array} args the arguments given with the command
     * 
     * @callback quoteProcessor start the function to process and pretify the quotes
     */
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

    /**
     * Process the quotes to look nice in the discord chat
     * 
     * @param {Array} data a multidimentional array containing all the data from the spreadsheet
     * @param {Array} args an array containing all the arguments given with the command:
     * - s/search:   return a quote/quotes matching the keywords given in args[s+1..end-1]
     * - r/random:   return a random quote
     * - l/list:     return a list of quotes
     * 
     * @send the message in the channel
     */
    function quoteProcessor(data, args) {
        if (args.length <= 0) {

            for (i = 0; i < data.length; i++) {
                if (!data[i][0]) {
                    data.splice(i, 1);
                    i--;
                }
            }

            let result = getRandomQuote(data);

            console.log(`${Date()}\tRequested random quote: "${result[0]}"\t-${result[1]} ${result[2]}, for "${message.author.username}"`);

            message.channel.send(`>>> *"${result[0]}"* \n\t\t\t-${result[1]} ${result[2]}`)
                .then(async message => collectReactions(message, result[0]));

        } else {
            if (args[0] == 'random' || args[0].toLowerCase() == `r`) {
                let result = getRandomQuote(data);

                message.channel.send(`>>> *"${result[0]}"* \n\t\t\t-${result[1]} ${result[2]}`);
                console.log(`${Date()}\tRequested random quote: "${result[0]}"\t-${result[1]} ${result[2]}, for ${message.author.username}`);
            } else if (args[0].toLowerCase() == `list` || args[0].toLowerCase() == `l`) {
                // Display list of all quotes
                listQuotes(data, 10, null);

            } else if (args[0].toLowerCase() == `search` || args[0].toLowerCase() == `s`) {
                // When the search command is included

                args.shift();

                let lastArg = args[args.length - 1].toLowerCase();

                if (lastArg != `list` && lastArg != `random` && lastArg != `l` && lastArg != `r`) {
                    args.push("random");
                }

                let keywords = args.slice(0, args.length - 1);

                let found = searchQuotes(keywords, data);

                if (found.length <= 0) {
                    // When no quote containing the keywords was found
                    message.channel.send(`> Couldn't find any quotes containing the keyword(s) **"${keywords.join(`", "`)}"**... Try some other keywords.`);
                    console.log(`${Date()}\tFound no quotes matching: "${keywords.join(`", "`)}", search executed by ${message.author.username}`);

                } else {
                    lastArg = args[args.length - 1].toLowerCase();

                    if (lastArg == `list` || lastArg == `l`) {
                        // If the user includes "list" on the end of the s!quote command
                        result = listQuotes(found, 10, keywords);

                    } else if (lastArg == `random` || lastArg == undefined || lastArg == `r`) {
                        // If the user includes "random" on the end of the s!quote command or does not include a keyword
                        result = getRandomQuote(found);

                        console.log(`${Date()}\tSearched the quotes database using "${keywords.join(`", "`)}", for "${message.author.username}".\n\tFound ${found.length} results. Returned: "${result[0]}" \t-${result[1]} ${result[2]}`);

                        message.channel.send(`>>> *"${result[0]}"* \n\t\t\t-${result[1]} ${result[2]}`)
                            .then(async message => collectReactions(message, result[0]));
                    }
                }
            }
        }
    }

    /**
     * Search through all the quotes if the user uses the option 's' or 'search'
     * 
     * @param {Array} keywords the keywords that should be found in the array
     * @param {Array} quotes a multidimentional array with the quotes from the spreadsheet
     * 
     * @returns {Array} an array with the quotes found to be matching the keywords
     */
    function searchQuotes(keywords, quotes) {
        //message.channel.send("This feature has temporarly been disabled, sorry for the inconvenience.");

        let start = [];
        
            // test for every keyword
        for (keyword of keywords) {
            let searchTerm = RegExp(keyword, 'i');

                // test every quote
            for (quote of quotes) {

                    // test for every property
                for (prop of quote) {

                    // If the regex matches the prop, add the quote to the array
                    if (searchTerm.test(prop)) {
                        start.push(quote);
                    }
                    }
                }
            }
        return start;
    }

    /** 
     * List the quotes if the user uses the option 'l' or 'list' 
     * And send a message in the channel with the result
     * 
     * @param {Array} rows a multidimentional array with all the quotes
     * @param {Number} quotesPerPage an intager amount of quote to display per page
     */
    function listQuotes(rows, quotesPerPage, keywords) {
        // message.channel.send(`> **This feature is not added yet. Soon:tm:**`);
        // console.log(`${message.author.username} tried to be sneaky and tried to access the list feature...`);
        /** 
         * TODO: 
         * - Explore multiple pages of quotes
         * - Beautify
         */

        let title;
        if (keywords === null) {
            title = "All of the quotes";
        } else {
            titel = "Quotes matching: " + keywords.join(", ") + "";
        } 

        let index = 0;

        let pagesAmount = Math.ceil(rows.length / quotesPerPage)
        let pages = [];

        // For every page, 
        for (let i = 0; i < pagesAmount; i++) {
            // Cut out quotesPerPage amount of rows and push them to a page
            pages.push(rows.splice(0, quotesPerPage));
        }

        // The basic embed template
        let template = {
            title: "",
            description: "View the whole spreadsheet with quotes [here](https://docs.google.com/spreadsheets/d/1VMfOyKhksxGLifxPoA58seul2XvvGV7db8-deVYxB4s/edit?usp=sharing).",
            color: 2520537,
            fields: [],
            footer: {
                text: "Page " + (index + 1) + " of " + pagesAmount
            }
        }

        pages[index].forEach(row => {
            result = getQuoter(row);
            template.title = title;
            template.fields.push({
                name: `*"${row[2]}"*`,
                value: `\t- ${result} ${row[3]}`
            });
        });

        message.channel.send({ embed: template});
    }

    /**
     * Get a random quote from a list of quotes
     * 
     * @param {Array} rows a multidimentional array with the quotes
     * 
     * @returns {Array} an array containing the quote and information
     */
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

    /**
     * Get the username of the person that the chosen quote is from
     * 
     * @param {Array} quote an array containing a single quote
     * 
     * @returns {String} the name of the person quoted
     */
    function getQuoter(quote) {
        let quoter = message.guild.members.cache.get(quote[1]);

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

    async function reactToOwnMessage(message) {
        // React to you own message
        try {
            await message.react('👍')
            await message.react('👎')
        } catch (error) {
            console.log(error);
        }
    }
    
    // Delete the original message
    message.delete();
};

