require("dotenv").config();
const { Bot } = require("grammy");
const BeatStore = require("./database/beatStore");

const bot = new Bot(process.env.BOT_API_KEY);
const beatStore = new BeatStore();

require("./features/startBot")(bot);
require("./features/addBeat")(bot, beatStore);
require("./features/links")(bot);
require("./features/showBeats")(bot, beatStore);
require("./features/faq")(bot);
require("./features/showTarifs")(bot);
require("./features/commandsMenu")(bot);
require("./features/catchErrors")(bot);

process.on('SIGINT', async () => {
  try {
    await beatStore.close();
    console.log('Соединение с БД закрыто');
    process.exit(0);
  } catch (err) {
    console.error('Ошибка при закрытии БД:', err);
    process.exit(1);
  }
});

bot.start();