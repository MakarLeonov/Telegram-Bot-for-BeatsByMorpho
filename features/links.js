module.exports = (bot) => {
  bot.command("links", async (ctx) => {
    const linksMessage = `
  Полезные ссылки:

YouTube с битами - [жмяк](https://t.me/beats_by_morpho)
BeatStars с битами - [жмяк](https://t.me/beats_by_morpho)
Telegram с битами - [жмяк](https://t.me/beats_by_morpho)
личка битмейкера - [написать](https://t.me/morpho_portis)
      `.trim();

    await ctx.reply(linksMessage, {
      parse_mode: "Markdown",
    });
  });
};
