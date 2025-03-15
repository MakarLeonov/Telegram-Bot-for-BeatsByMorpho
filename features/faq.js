const { InlineKeyboard } = require("grammy");
const faq = require("../data/faq.json");

const answerMessageIds = new Map();

module.exports.faq = (bot) => {
  bot.command("faq", async (ctx) => {
    const buttonRows = faq.faq.map((item, index) => [
      InlineKeyboard.text(item.question, `faq_${index}`),
    ]);
    const keyboard = InlineKeyboard.from(buttonRows);

    await ctx.reply("Часто задаваемые вопросы:", {
      reply_markup: keyboard,
    });
  });

  bot.callbackQuery(/faq_\d+/i, async (ctx) => {
    const { data } = ctx.callbackQuery;
    const chatId = ctx.chat.id;
    await ctx.answerCallbackQuery();

    const index = parseInt(data.split("_")[1]);
    const faqItem = faq.faq[index];

    if (faqItem) {
      const existingData = answerMessageIds.get(chatId);
      if (existingData && existingData.lastIndex === index) {
        return;
      }

      const response = `
*${faqItem.question}* \n\n${faqItem.answer}
      `.trim();

      if (existingData && existingData.messageId) {
        try {
          await ctx.api.editMessageText(
            chatId,
            existingData.messageId,
            response,
            {
              parse_mode: "Markdown",
            }
          );
          answerMessageIds.set(chatId, {
            messageId: existingData.messageId,
            lastIndex: index,
          });
        } catch (error) {
          console.error("Ошибка при редактировании сообщения:", error);
          const newMessage = await ctx.reply(response, {
            parse_mode: "Markdown",
          });
          answerMessageIds.set(chatId, {
            messageId: newMessage.message_id,
            lastIndex: index,
          });
        }
      } else {
        const newMessage = await ctx.reply(response, {
          parse_mode: "Markdown",
        });
        answerMessageIds.set(chatId, {
          messageId: newMessage.message_id,
          lastIndex: index,
        });
      }
    } else {
      await ctx.reply("Такого вопроса не существует", {
        parse_mode: "Markdown",
      });
    }
  });
};
