# Telegram PDF Bot

This bot allows users to download MGU exam result PDFs by providing their Exam ID and PRN in the format `EXAM_ID;PRN`. The bot fetches the PDF from the original endpoint and sends it back to the user.

## Deployment

The bot is deployed using a serverless function on [Vercel](https://vercel.com/).

### Setting the Webhook

Set the webhook URL for your bot using the following command:

```bash
curl -F "url=https://<your-vercel-url>/api/" https://api.telegram.org/bot<your-bot-token>/setWebhook
```

Replace `<your-vercel-url>` with your Vercel deployment URL and `<your-bot-token>` with your Telegram bot token.

## Usage

1. Send a message to the bot in the format:

   ```
   EXAM_ID;PRN
   ```

   Example:

   ```
   1;MG24101B9773
   ```

2. The bot will process the request and send the corresponding PDF as a document.

## Dependencies

- [Telegraf](https://telegraf.js.org/): A modern Telegram bot framework.
- [node-fetch](https://github.com/node-fetch/node-fetch): A lightweight module that brings `window.fetch` to Node.js.
