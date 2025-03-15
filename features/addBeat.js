require("dotenv").config();

module.exports = (bot, beatStore) => {
  const CHANNEL_ID = process.env.CHANNEL_ID; 

  bot.command('upload', async (ctx) => {
    await ctx.reply(
      'Для загрузки бита скинь аудиофайл в формате mp3 с текстом, в котором будет указано название бита, его bpm и жанры (с помощью "#", это опционально). Например:\n\n' +
      'Cool Beat 140bpm #grizelda #detroit\n' +
      'Или просто отправь аудиофайл без текста.'
    );
  });

  bot.on('message:audio', async (ctx) => {
    try {
      console.log('Получено аудио сообщение:', JSON.stringify(ctx.message, null, 2));
      const fileId = ctx.message.audio.file_id;
      if (!fileId) {
        throw new Error('file_id не найден в сообщении');
      }

      const caption = ctx.message.caption || '';
      console.log('Текст сообщения:', caption);

      let title = null;
      let bpm = null;
      let genres = [];

      if (caption.trim()) {
        const bpmMatch = caption.match(/(\d+)bpm/i);
        if (bpmMatch) {
          bpm = bpmMatch[1];
        }

        const genreMatches = caption.match(/#\w+/g) || [];
        if (genreMatches.length > 0) {
          genres = genreMatches;
        }

        let cleanCaption = caption;
        if (bpmMatch) {
          cleanCaption = cleanCaption.replace(bpmMatch[0], '');
        }
        if (genreMatches.length > 0) {
          genreMatches.forEach((genre) => {
            cleanCaption = cleanCaption.replace(genre, '');
          });
        }
        cleanCaption = cleanCaption.trim();

        if (cleanCaption) {
          title = cleanCaption;
        }
      }

      const beatId = await beatStore.add(fileId, title, bpm, genres);
      console.log(`Бит с ID ${beatId} успешно добавлен в БД`);

      let channelCaption = '';
      if (title) {
        channelCaption = title;
        if (bpm) channelCaption += ` (${bpm}bpm)`;
      }
      if (channelCaption) channelCaption += '\n\n';
      channelCaption += '#beats_by_morpho';
      if (genres.length > 0) channelCaption += ` ${genres.join(' ')}`;

      await bot.api.sendAudio(CHANNEL_ID, fileId, { caption: channelCaption });
      console.log(`Бит опубликован в канал ${CHANNEL_ID}`);

      let response = `Бит ${title ? `"${title}"` : ''} успешно добавлен!`;
      if (bpm) response += `\nBPM: ${bpm}`;
      if (genres.length > 0) response += `\nЖанры: ${genres.join(', ')}`;

      await ctx.reply(response);
      console.log('Сообщение отправлено:', response);
    } catch (error) {
      console.error('Ошибка при добавлении бита:', error);
      await ctx.reply('Ошибка при добавлении бита');
      console.log('Сообщение об ошибке отправлено');
    }
  });
};