const qrcode = require("qrcode"); // lowercase, matches the variable
const { Client, LocalAuth } = require("whatsapp-web.js");

let qrCodeData = null;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", async (qr) => {
  qrCodeData = await qrcode.toDataURL(qr); // fixed variable name
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body === "!ping") {
    msg.reply("pong");
  }
});

const sendWAMessage = async (num, name) => {
  const number = `91${num}`;
  const chatId = number + "@c.us";

  const message = `🎉 Happy Birthday, ${name}! 🥳✨
Wishing you lots of happiness, success, and good health. Have an amazing year ahead! 🎂🎁`;

  await client.sendMessage(chatId, message);
};
const check = () => {
  const chatId = "91" + process.env.NUMBER + "@c.us";
  sendWAMessage(chatId, "Whatsapp is working");
};
client.initialize();

// export a function to always get latest QR
const getQRCode = () => qrCodeData;

module.exports = { sendWAMessage, getQRCode, check };
