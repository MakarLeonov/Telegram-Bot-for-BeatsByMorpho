require("dotenv").config();
const { Bot } = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);
const CHANNEL_ID = process.env.CHANNEL_ID;
const ADMIN_ID = +process.env.ADMIN_ID;
const beats = [];

const { faq } = require("./features/faq");
const { showTarifs } = require("./features/showTarifs");
require("./features/startBot")(bot);
require("./features/addBeat")(bot, beats);
require("./features/links").links(bot);

///////////////////////////////////////////////////////////////
// ЗАГРУЗКА БИТОВ

bot.command("beats", async (ctx) => {
  if (beats.length === 0) {
    return ctx.reply("Пока нет загруженных битов.");
  }

  const latestBeats = beats.slice(-10);

  const mediaGroup = latestBeats.map((beat) => ({
    type: "audio",
    media: beat.fileId,
  }));

  try {
    // await ctx.reply("*Актуальные биты:*", {
    //   parse_mode: "Markdown",
    // });
    await ctx.replyWithMediaGroup(mediaGroup);
    await ctx.reply(
      "Ещё больше битов в [beats by morpho](https://t.me/beats_by_morpho)",
      {
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("Ошибка при отправке битов.");
  }
});

///////////////////////////////////////////////////////////////
// СБОРКА ПРИЛОЖЕНИЯ

faq(bot);

showTarifs(bot);

require("./features/commandsMenu")(bot);

const { catchErrors } = require("./features/catchErrors");
catchErrors(bot);

bot.start();
