const { InlineKeyboard } = require("grammy");
const tarifs = require("../data/tarifs.json");

module.exports.showTarifs = (bot) => {
  bot.command("tarifs", async (ctx) => {
    const buttonRows = Object.keys(tarifs).map((label) => [
      InlineKeyboard.text(label, label),
    ]);
    const keyboard = InlineKeyboard.from(buttonRows);

    await ctx.reply("Актуальные тарифы на сегодня:", {
      reply_markup: keyboard,
    });
  });

  bot.callbackQuery(/.+/i, async (ctx) => {
    const { data } = ctx.callbackQuery;
    await ctx.answerCallbackQuery();
    await ctx.reply(
      `*${tarifs[data].title}* \n\n${tarifs[data].description} \n\nPrice: ${tarifs[data].price}
    `,
      { parse_mode: "Markdown" }
    );
  });
};
