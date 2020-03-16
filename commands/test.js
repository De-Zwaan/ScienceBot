exports.run = (client, message, args) => {
    if (message.author.id != client.config.ownerID) return message.channel.send(`> Don't touch me!`);

    // let server = client.guilds.find(guild => guild.id == 436144798462771200).roles;
    // console.log(server)
    /*
    let channel = server.channels.find(channel => channel.name == "quotes2");

        channel.fetchMessages({ limit: 100 })
        .then(fetched => {
            let pins = fetched.filter(fetchedMessage => fetchedMessage.pinned);

            let quotes = pins.filter(pin => pin.content.indexOf(":") >= 0);

            quotes.forEach(quote => {
                let mentions = quote.mentions.users.find(user => Object.keys(user)[0] == 'id')
                let quoted;
                let quotedId

                if (mentions) {
                    quoted = mentions.username;
                    quotedId = mentions.id;
                } else {
                    quoted = quote.content.split(" ").slice(0, 2).join(" ");
                    quotedId = 'null'
                }

                let splitQuote = quote.content.split(" ")
                let printQuote = splitQuote.slice(splitQuote.findIndex(k => k == "quote:") + 1, splitQuote.length).join(" ")

                console.log(`${quoted} \t ${quotedId} \t ${printQuote} \t ${new Date(quote.createdTimestamp).getMonth() + 1}-${new Date(quote.createdTimestamp).getDate()}-${new Date(quote.createdTimestamp).getYear() %100} \t ${quote.author.username}`) // 
            });
        })
        .catch(console.error);
    //}
    */

    console.log(client.user.id)
    // console.log(message.mentions.users.array().length);
    
    message.delete();
};
