const { Client, GatewayIntentBits } = require("discord.js");

const OpenSea_api_key = "";//opensea api key

const allTokens = [
    { "name": "", "address": "", "minID": 0, "maxID":1000  }
];

const channelID = "";
const channelID1 = "";


const botId = "";
const BOT_TOKEN = "";//private 


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent //must enable in discord developer portal
    ]
});



client.on("messageCreate", async message => {

    if ((message.channelId == channelID || message.channelId == channelID1) && message.authorId != botId) {
        console.log(JSON.stringify(message));
        if (message.content.startsWith("#")) {
            const tokenName = message.content.split(" ")[1];
            let tokenNumQ = 0;
            for (let i = 0; i < allTokens.length; i++) {
                if (allTokens[i].name.toLowerCase() == tokenName.toLowerCase()) {
                    try {
                        let tokenNum = message.content.split(" ")[0].substring(1);
                        if (tokenNum == "?") {
                            tokenNumQ = Math.floor(Math.random() * (allTokens[i].maxID - allTokens[i].minID + 1) + allTokens[i].minID);
                        }
                        else if (isNaN(tokenNum) || parseInt(tokenNum) < 0) {
                            message.reply(`Invalid token number. For a random token, use #? token_name`);
                            return;
                        }
                        else {
                            tokenNumQ = Math.min(allTokens[i].minID + parseInt(tokenNum), allTokens[i].maxID);
                        }

                        const options = { method: 'GET', headers: { 'X-API-KEY': OpenSea_api_key } };

                        const resp = await fetch(`https://api.opensea.io/api/v1/asset/${allTokens[i].address}/${tokenNumQ}/?include_orders=false`, options)
                        const tokenData = await resp.json();
                        console.log(tokenData);
                        const data = {
                            "content": null,
                            "embeds": [
                                {
                                    "title": (allTokens[i].name + " #" + (tokenNumQ - allTokens[i].minID)).toString(),
                                    "color": 130837,
                                    "fields": [
                                        {
                                            "name": "OpenSea",
                                            "value": "[open]" + "(" + tokenData.permalink.toString() + ")",
                                            "inline": true
                                        },
                                        {
                                            "name": "ArtBlocks",
                                            "value": "[open]" + "(" + tokenData.external_link.toString() + ")",
                                            "inline": true
                                        }
                                    ],
                                    "image": {
                                        "url": tokenData.image_original_url.toString()
                                    },
                                    "footer": {
                                        "text": "NFT Info Bot",
                                    }
                                }
                            ],
                            "attachments": []
                        }
                        message.reply({ embeds: data.embeds }); return;
                    } catch (e) {
                        message.reply(`An error occured, please try again later.`);
                        console.log("Error " + e);
                        return;
                    }
                }
            }
            message.reply(`Invalid token name. Please use one of the following: ${allTokens.map(x => x.name).join(", ")}`);
        }
    }
});
client.once("ready", () => { console.log("Bot is online") });

client.login(BOT_TOKEN);