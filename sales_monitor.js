const { OpenSeaStreamClient } = require("@opensea/stream-js");
const { WebSocket } = require("ws");
const axios = require("axios");

const OpenSea_api_key = "";
const webhook_url = "";
const client = new OpenSeaStreamClient({
  token: OpenSea_api_key,
  connectOptions: {
    transport: WebSocket,
  },
});
client.onItemSold("collection name on opensea", (event) => {
  handle(event);
});
client.onItemSold("collection name on opensea", (event) => {
  handle(event);
});
client.onItemSold("collection name on opensea", (event) => {
  handle(event);
});
client.onItemSold("collection name on opensea", (event) => {
  handle(event);
});
/*client.onItemSold('reddit-rabbids-x-reddit-collectible-avatars', (event) => {
    handle(event)
});
*/
function handle(event) {
  try {
    console.log(JSON.stringify(event));
    let price = 0;
    try {
      for (let i = 0; i < event.payload.protocol_data.parameters.consideration.length; i++) {
        price += event.payload.protocol_data.parameters.consideration[i].endAmount / Math.pow(10, event.payload.payment_token.decimals);
      }
      price = price.toFixed(3);
      price += " " + event.payload.payment_token.symbol.toString();
    } catch (e) {
      console.log(e);
    }
    let buyer = "unknown";
    let seller = "unknown";
    try {
      buyer = event.payload.taker.address;
    } catch (e) {
      console.log(e);
    }
    try {
      seller = event.payload.protocol_data.parameters.consideration[0].recipient;
    } catch (e) {
      console.log(e);
    }
    const imageUrl = event.payload.item.metadata.image_url;
    const url = event.payload.item.permalink;

    webhook(buyer, seller, price, imageUrl, url);
  } catch (e) {
    console.log(e);
  }
}

async function webhook(buyer, seller, price, imageUrl, url) {
  const data = {
    content: null,
    embeds: [
      {
        title: "New Sale",
        color: 130837,
        fields: [
          {
            name: "Buyer",
            value: buyer,
          },
          {
            name: "Seller",
            value: seller,
          },
          {
            name: "Sold for",
            value: price,
            inline: true,
          },
          {
            name: "OpenSea URL",
            value: "[open]" + "(" + url.toString() + ")",
            inline: true,
          },
        ],
        image: {
          url: imageUrl.toString(),
        },
        footer: {
          text: "Sales Monitor",
        },
      },
    ],
    attachments: [],
  };
  axios
    .post(webhook_url, data)
    .then(function (response) {})
    .catch(function (error) {
      console.log(error);
    });
}
