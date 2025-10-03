const cron = require("node-cron");
const { format } = require("date-fns");
const userModel = require("../models/user");
const sendEmail = require("../utils/sendGrid");
// const sendWAMessage = require("./whatsapp");

cron.schedule("17 22 * * *", async () => {
  try {
    const today = new Date();
    const todayMonthDay = format(today, "MM-dd");

    const users = await userModel.find({
      dob: { $exists: true },
      $expr: {
        $eq: [
          { $dateToString: { format: "%m-%d", date: "$dob" } },
          todayMonthDay,
        ],
      },
    });

    for (let user of users) {
      const data = {
        to: user.email,
        subject: "Birthday Wish",
        text: `Happy Birthday ${user.name}, may this day bring a lot of joy and happiness to your life. 
I pray to God to bless you and your family with health and wealth. We will meet soon. 
- Aayush Bhatt`,
      };

      await sendEmail(data);

      // if (user.number) {
      //   await sendWAMessage(user.number.toString(), user.name);
      // }
    }
  } catch (err) {
    console.error("Error in fetching birthdays:", err);
  }
});
