const cron = require("node-cron");
const { format } = require("date-fns");
const userModel = require("../models/user");
const sendEmail = require("../utils/sendGrid");

cron.schedule("0 9 * * *", async () => {
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
        text: `Happy Birthday ${user.name}, may this day bring a lot of joy and happiness to your life. I pray to God to bless you and your family with health and wealth. We will meet soon. 
    - Aayush Bhatt`,
      };

      await sendEmail(data);
    }
  } catch (err) {
    console.error("Error fetching birthdays:", err);
  }
});
