import "dotenv/config";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const baseUrl = "https://ugpapi.mgu.ac.in/ugp/api/Result/singleResultpdf";
const refererUrl = "https://edp.mgu.ac.in/";
const captchaIn = "R4YNAI";
const captchaId = 110657;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Welcome! Send your details in the format: EXAM_ID;PRN\n\nExample: 1;MG14101B9673"
  );
});

bot.on("text", async (ctx) => {
  const message = ctx.message.text.trim();
  const [examId, prn] = message.split(";");

  if (!examId || !prn) {
    return ctx.reply(
      "Invalid format! Please send your details in the format: EXAM_ID;PRN\n\nExample: 1;MG24101B9773"
    );
  }

  console.log(`User: ${ctx.from.username || ctx.from.first_name}`);
  console.log(`Exam ID: ${examId}, PRN: ${prn}`);

  try {
    const url = `${baseUrl}?examid=${examId}&prn=${prn}&captcha_in=${captchaIn}&captcha_id=${captchaId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: refererUrl,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to download PDF for PRN ${prn}: ${response.statusText}`
      );
      return ctx.reply("Failed to fetch result. Please check your details.");
    }

    const buffer = await response.buffer();
    await ctx.replyWithDocument(
      {
        source: buffer,
        filename: `${prn}.pdf`,
      },
      { caption: "Here is your result PDF!" }
    );

    console.log(`PDF sent successfully for PRN ${prn}`);
  } catch (error) {
    console.error(`Error downloading PDF for PRN ${prn}:`, error.message);
    ctx.reply("An error occurred while fetching the PDF. Please try again.");
  }
});

const isWebhook = process.env.USE_WEBHOOK === "true";
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";

if (isWebhook && WEBHOOK_URL) {
  bot.telegram.setWebhook(`${WEBHOOK_URL}/bot${BOT_TOKEN}`);
  bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);
  console.log(`Webhook mode enabled at ${WEBHOOK_URL}/bot${BOT_TOKEN}`);
} else {
  bot.launch();
  console.log("Polling mode enabled");
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
