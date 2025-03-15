const ADMIN_ID = +process.env.ADMIN_ID;

module.exports = (bot) => {
  bot.command("start", async (ctx) => {
    const isAdmin = ctx.from.id === ADMIN_ID;
    const greetingMessage = `
Привет, я информационный бот!
Вот мои основные команды:

/beats - показать свежие биты
${isAdmin ? "/upload - загрузить новый бит" : ""}
/tarifs - показать актуальные тарифы
/faq - часто задаваемые вопросы
/links - полезные ссылки
`.trim();

    await ctx.reply(greetingMessage);
  });
};
