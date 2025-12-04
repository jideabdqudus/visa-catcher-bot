require("dotenv").config();

const axios = require("axios");
const nodemailer = require("nodemailer");

const SITES = [
  {
    name: "Netherlands Visa",
    url: "sample-url", // example https://visacatcher.bot/appointments/london/netherlands
    textToLookFor: "No Current Availability", // word to check for 
    hasSentNotification: false,
  },
  {
    name: "Portugal Visa",
    url: "sample-url", // example https://visacatcher.bot/appointments/london/portugal
    textToLookFor: "No Current Availability",
    hasSentNotification: false,
  },
];

const CONFIG = {
  senderEmail: process.env.SENDER_PASSWORD,
  senderPassword: process.env.SENDER_MAIL,
  receiverEmail: process.env.RECEIVER_MAIL,
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CONFIG.senderEmail,
    pass: CONFIG.senderPassword.replace(/\s+/g, ""),
  },
});

async function sendAlert(site) {
  console.log("📧 Sending email notification...");
  try {
    await transporter.sendMail({
      from: `"Slot Bot" <${CONFIG.senderEmail}>`,
      to: CONFIG.receiverEmail,
      subject: `🚨 SLOT OPEN: ${site.name}`,
      text: `The text "${site.textToLookFor}" has disappeared from ${site.url}.`,
      html: `
            <h2>${site.name} is Available!</h2>
            <p>The text <b>"${site.textToLookFor}"</b> is no longer on the page.</p>
            <p><a href="${site.url}">Click here to apply now</a></p>
        `,
    });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error(`❌ Failed to send email for ${site.name}:`, error);
  }
}

async function checkAllSites() {
  for (const site of SITES) {
    try {
      const response = await axios.get(site.url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      const html = response.data;
      const isSlotOpen = !html.includes(site.textToLookFor);

      if (isSlotOpen) {
        if (!site.hasSentNotification) {
          console.log(
            `[${new Date().toLocaleTimeString()}] 🟢 OPEN: ${site.name}`
          );
          await sendAlert(site);
          site.hasSentNotification = true;
          console.log("✅ Success! Shutting down the entire bot.");
          process.exit(0);
        } else {
          console.log(
            `[${new Date().toLocaleTimeString()}] 🟢 ${
              site.name
            } is still open (Alert already sent).`
          );
        }
      } else {
        if (site.hasSentNotification) {
          console.log(
            `[${new Date().toLocaleTimeString()}] ⚠️ ${
              site.name
            } has closed again. Resetting.`
          );
          site.hasSentNotification = false;
        }
        console.log(
          `[${new Date().toLocaleTimeString()}] 🔴 Waiting: ${site.name}`
        );
      }
    } catch (error) {
      console.error(`⚠️ Error checking ${site.name}: ${error.message}`);
    }
  }
}

console.log(`🤖 Bot started. Monitoring ${SITES.length} sites...`);
checkAllSites();
const interval = process.env.CHECK_INTERVAL || 5000;
setInterval(checkAllSites, interval);
