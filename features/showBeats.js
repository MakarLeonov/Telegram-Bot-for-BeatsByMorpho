async function showBeats(ctx, beatStore) {
  try {
    const latestBeats = await beatStore.getLatest(10);
    
    if (latestBeats.length === 0) {
      return ctx.reply("Пока нет загруженных битов.");
    }

    console.log('Последние биты:', latestBeats);
    const mediaGroup = latestBeats.map((beat) => {
      return {
        type: "audio",
        media: beat.fileId,
      };
    });

    await ctx.replyWithMediaGroup(mediaGroup);
    await ctx.reply(
      "Ещё больше битов в [beats by morpho](https://t.me/beats_by_morpho)",
      {
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    console.error('Ошибка при отправке битов:', error);
    await ctx.reply("Ошибка при отправке битов.");
  }
}

module.exports = (bot, beatStore) => {
  bot.command("beats", (ctx) => showBeats(ctx, beatStore));
};