import express, { Request, Response } from 'express'
import dotenv from "dotenv";
import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import bodyParser, { json } from 'body-parser';

dotenv.config();

const app = express();
const { PORT, TOKEN, SERVER_URL, SECRET_PATH, TELEGRAM_API } = process.env;
const WEBHOOK_URL = (SERVER_URL || 'localhost') + SECRET_PATH;

if (TOKEN === undefined) {
  throw new Error('TOKEN is missing');
}

const bot: Telegraf<Context<Update>> = new Telegraf(TOKEN as string);

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Telegram bot");
});

bot.help((ctx) => {
  ctx.reply('Type /start to begin');
  ctx.reply('Type /quit to stop');
});

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
});

bot.on('sticker', (ctx) => ctx.reply('nice sticker bro 👍'));

bot.hears('hi', (ctx) => ctx.reply('yo'));

bot.hears('@FabianoVasconcelos', (ctx) => ctx.reply('fabiano é um menino de ouro'));

bot.on('new_chat_members', (ctx) => ctx.reply('' + ctx.from.first_name + ', welcome!'));

bot.command('quit', (ctx) => {
  ctx.telegram.leaveChat(ctx.message.chat.id);
  ctx.leaveChat();
});

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.telegram.setWebhook(`${WEBHOOK_URL}`);
app.use(bot.webhookCallback(`${SECRET_PATH}`));

app.listen(PORT || 3333, async ()=> {
  console.log('☠☠☠ app running on port ', PORT || 3333);
});