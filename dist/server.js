"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const { TOKEN, SERVER_URL, TELEGRAM_API } = process.env;
const TELEGRAM_API_URL = `${TELEGRAM_API}${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
const bot = new telegraf_1.Telegraf(TOKEN);
app.use(body_parser_1.default.json());
app.get("/", function (req, res) {
    res.send("test");
});
const init = async () => {
    try {
        console.log("*** Initializing bot\n");
        console.log(`*** Setting webhook: ${TELEGRAM_API_URL}/setWebhook?url=${WEBHOOK_URL}\n`);
        app.use(bot.webhookCallback('/setWebhook'));
        bot.telegram.setWebhook(`${TELEGRAM_API_URL}/setWebhook?url=${WEBHOOK_URL}`);
        // https://api.telegram.org/bot<TOKEN>/getUpdates?allowed_updates=[%22update_id%22,%20%22message%22,%20%22edited_message%22,%20%22channel_post%22,%20%22edited_channel_post%22,%20%22inline_query%22,%20%22chosen_inline_result%22,%20%22callback_query%22,%20%22shipping_query%22,%20%22pre_checkout_query%22,%20%22poll%22,%20%22poll_answer%22,%20%22my_chat_member%22,%20%22chat_member%22]
    }
    catch (error) {
        throw new Error("Something went wrong (init): " + error);
    }
};
app.post(URI, async (req, res) => {
    try {
        console.log("*********req.body: " + JSON.stringify(req.body));
        if (req.body.message.chat.id && req.body.message.text) {
            const chatId = req.body.message.chat.id;
            const text = req.body.message.text;
            console.log("chatId: " + chatId);
            console.log("text: " + text);
            return res.send();
        }
    }
    catch (error) {
        throw new Error("Something went wrong (post):" + error);
    }
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
bot.hears('python', (ctx) => ctx.reply('lmao, python sucks'));
bot.hears('@FabianoVasconcelos', (ctx) => ctx.reply('fabiano é um menino de ouro'));
bot.hears('Quem é o mais bonito do grupo?', (ctx) => ctx.reply('O Lucas, claro!'));
bot.on('new_chat_members', (ctx) => ctx.reply('' + ctx.from.first_name + ': eae fulerage, seja bem vindo'));
bot.command('quit', (ctx) => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id); // Context shortcut
    ctx.leaveChat();
});
// bot.launch();
app.listen(process.env.PORT || 3333, async () => {
    console.log('☠☠☠ app running on port ', process.env.PORT || 3333);
    await init();
});
//# sourceMappingURL=server.js.map