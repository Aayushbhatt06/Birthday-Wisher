const express = require("express");
const sendOTP = require("./controller/sendOTP");
const submit = require("./controller/submit");
const verifyOtp = require("./controller/verifyOtp");
const { sendWAMessage, getQRCode, check } = require("./utils/whatsapp");
require("./utils/whatsapp");
require("dotenv");
require("./models/db");
const cors = require("cors");
const app = express();
require("./utils/cronjobs");
app.use(
  cors(["http://localhost:5173", "https://birthday-wisher-plum.vercel.app"])
);
app.use(express.json());

const PORT = process.env.PORT || "3000";

app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.post("/api/sendotp", sendOTP);
app.post("/api/submit", submit);
app.post("/api/verifyotp", verifyOtp);
app.get("/check", check);
app.get("/qr", (req, res) => {
  const qrCodeData = getQRCode();
  if (qrCodeData) {
    res.send(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#111;color:white;flex-direction:column;">
          <h2>Scan this QR with WhatsApp</h2>
          <img src="${qrCodeData}" alt="WhatsApp QR Code" />
        </body>
      </html>
    `);
  } else {
    res.send(
      "<h2>QR not generated yet. Please refresh after a few seconds.</h2>"
    );
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`);
});
