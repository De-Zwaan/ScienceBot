exports.run = (bot) => {

    try {
        require('wtfnode').init();
    } catch (err) {
        console.error(err);
    };

    // Getting resources   
    const clientId = bot.config.RPCClientID;

    // Setting up client
    const DiscordRPC = require('discord-rpc');
    const client = new DiscordRPC.Client({ transport: 'ipc' });
    
    // Loading statuses
    const details = bot.box.details;
    
    // Change status
    async function changeStatus(i) {
        if (!client) {
            return;
        }

        if (i > details.length - 1) {
            i = 0;
        }

        // Get detail from list in box
        let detail = details[i];
        i++;

        client.setActivity({
            state: 'Mixing Chemicals',
            details: detail,
            startTimestamp: new Date(),
            // endTimestamp: new Date(),
            largeImageKey: 'rockymounatain_nacl_v1',
            largeImageText: "DON'T TRY THIS AT HOME!",
            smallImageKey: 'logo',
            smallImageText: 'Atoms!',
            partyId: 'science_party',
            partySize: 1,
            partyMax: 5,
            // matchSecret: '',
            // joinSecret: '',
            // spectateSecret: '',
            instance: true
        });
        console.log('Changed status to: "' + detail + '", ' + (i + 1) + '.');

        // Loop every 480000 ms = 480 s = 8 min.
        setTimeout(changeStatus, 480000, i);
    }

    // Bot is ready
    client.on('ready', () => {
        changeStatus(Math.round(Math.random() * details.length));

        // console.log(client.user);
        
        client.subscribe('ACTIVITY_JOIN', ({ secret }) => {
            console.log('should join game with secret:', secret);
        });
        
        client.subscribe('ACTIVITY_SPECTATE', ({ secret }) => {
            console.log('should spectate game with secret:', secret);
        });

        client.subscribe('ACTIVITY_JOIN_REQUEST', (user) => {
            console.log('user wants to join:', user);
        });        
    });

    client.login({ clientId }).catch(console.error);

}