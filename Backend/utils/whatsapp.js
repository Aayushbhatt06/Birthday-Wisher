const qrcode = require("qrcode"); // lowercase
const { Client, LocalAuth } = require("whatsapp-web.js");
require("dotenv").config(); // load env variables

let qrCodeData = null;
let isReady = false; // track client readiness

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", async (qr) => {
  qrCodeData = await qrcode.toDataURL(qr); // convert to base64 image
});

client.on("ready", () => {
  console.log("Client is ready!");
  isReady = true;
});

client.on("message", (msg) => {
  if (msg.body === "!ping") {
    msg.reply("pong");
  }
});

// send WhatsApp message safely
const sendWAMessage = async (num, name) => {
  if (!isReady)
    throw new Error("WhatsApp client not ready. Scan the QR first.");

  const number = `91${num}`;
  const chatId = `${number}@c.us`;

  const message = `🎉 Happy Birthday, ${name}! 🥳✨
Wishing you lots of happiness, success, and good health. Have an amazing year ahead! 🎂🎁`;

  await client.sendMessage(chatId, message);
};

// check route
const check = async (req, res) => {
  try {
    await sendWAMessage(process.env.NUMBER, "WhatsApp is working");
    res.send("Message sent successfully!");
  } catch (err) {
    console.error("Error sending WhatsApp message:", err.message);
    res.status(500).send("Failed to send message: " + err.message);
  }
};

client.initialize();

// getter for latest QR code
const getQRCode = () => qrCodeData;

module.exports = { sendWAMessage, getQRCode, check };
