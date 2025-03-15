const { Keyboard } = require("grammy");
const faq = require("../data/faq.json");

module.exports.faq = (bot) => {
  bot.command("faq", async (ctx) => {
    const keyboard = new Keyboard();
    faq.faq.forEach((item) => {
      keyboard.text(item.question).row();
    });
    keyboard.text("Закрыть").row();
    keyboard.persistent().resized();

    await ctx.reply("Часто задаваемые вопросы:", {
      reply_markup: keyboard,
    });
  });

  bot.hears(
    faq.faq.map((item) => item.question).concat("Закрыть"),
    async (ctx) => {
      const selectedText = ctx.message.text;

      if (selectedText === "Закрыть") {
        await ctx.reply("Клавиатура закрыта", {
          reply_markup: { remove_keyboard: true },
        });
      } else {
        const faqItem = faq.faq.find((item) => item.question === selectedText);

        if (faqItem) {
          const response = faqItem.answer.trim();

          await ctx.reply(response, {
            parse_mode: "Markdown",
          });
        }
      }
    }
  );
};
