const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

const sendWAMessage = async (num, name) => {
  const number = `91${num}`;
  const chatId = number + "@c.us";

  const message = `🎉 Happy Birthday, ${name}! 🥳✨
Wishing you lots of happiness, success, and good health. Have an amazing year ahead! 🎂🎁`;

  await client.sendMessage(chatId, message);
};

client.initialize();

module.exports = sendWAMessage;
