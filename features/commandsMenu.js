const ADMIN_ID = +process.env.ADMIN_ID;

module.exports = (bot) => {
  bot.api.setMyCommands([
    { command: "beats", description: "Показать биты" },
    { command: "tarifs", description: "Показать тарифы" },
    { command: "faq", description: "Часто задаваемые вопросы" },
    { command: "links", description: "Полезные ссылки" },
  ]);

  bot.on("message", async (ctx) => {
    if (ctx.from.id === ADMIN_ID) {
      await bot.api.setMyCommands(
        [
          { command: "beats", description: "Показать биты" },
          { command: "upload", description: "Загрузить бит" },
          { command: "tarifs", description: "Показать тарифы" },
          { command: "faq", description: "Часто задаваемые вопросы" },
          { command: "links", description: "Полезные ссылки" },
        ],
        { scope: { type: "chat", chat_id: ctx.chat.id } }
      );
    }
  });
};
