require("dotenv").config();
const Telegraf = require("telegraf");
const session = require("telegraf/session");
const { textHandler } = require("./src/handlers/textHandler");
const { commandHandler } = require("./src/handlers/commandHandler");
const commandParts = require("telegraf-command-parts");
const { notification } = require("./src/notification");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(commandParts());
bot.context.db = { lockedUsers: [] };

// log
 bot.use(Telegraf.log()); // for debugging

// Logger
 bot.use(async (ctx, next) => {
   console.log("**********");
   if (ctx.updateSubTypes[0] === 'text') console.log(`text:${ctx.message.text}\nfrom ${ctx.from.id}`);
   await next();
 });
// end log

bot.catch(e => console.log(e));

commandHandler(bot);

// Text Handler must be last updates handler !
textHandler(bot);

bot.launch();
bot.telegram.getMe().then(res => console.log(res));
console.log("Bot running locally\n");
notification(bot);
