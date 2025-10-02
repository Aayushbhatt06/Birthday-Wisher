const express = require("express");
const sendOTP = require("./controller/sendOTP");
const submit = require("./controller/submit");
const verifyOtp = require("./controller/verifyOtp");
require("dotenv");
require("./models/db");
const cors = require("cors");
const app = express();

app.use(cors("http://localhost:5173"));
app.use(express.json());

const PORT = process.env.PORT || "3000";

app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.post("/api/sendotp", sendOTP);
app.post("/api/submit", submit);
app.post("/api/verifyotp", verifyOtp);

app.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`);
});
