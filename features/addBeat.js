const CHANNEL_ID = process.env.CHANNEL_ID;
const ADMIN_ID = parseInt(process.env.ADMIN_ID);

module.exports = (bot, beats) => {
  bot.command("upload", async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) {
      return ctx.reply("Эта команда доступна только администратору.");
    }
    if (ctx.chat.type !== "private") {
      return ctx.reply("Эта команда доступна только в личном чате.");
    }
    await ctx.reply("Отправь мне аудиофайл (MP3) для загрузки в канал.");
  });

  bot.on("message:audio", async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) {
      return;
    }
    if (ctx.chat.type !== "private") return;

    const audio = ctx.message.audio;
    const fileId = audio.file_id;

    try {
      const sentMessage = await ctx.api.sendAudio(CHANNEL_ID, fileId, {
        title: audio.file_name || `Beat ${beats.length + 1}`,
        performer: "beats_by_morpho",
      });

      beats.push({
        name: audio.file_name || `Beat ${beats.length + 1}`,
        messageId: sentMessage.message_id,
        fileId: fileId,
      });

      await ctx.reply(
        `Бит "${audio.file_name || "без названия"}" загружен в канал!`
      );
    } catch (error) {
      console.error(error);
      await ctx.reply(
        "Ошибка при загрузке бита. Убедитесь, что файл в формате MP3."
      );
    }
  });
};
