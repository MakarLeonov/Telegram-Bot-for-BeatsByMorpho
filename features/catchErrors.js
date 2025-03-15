const { GrammyError, HttpError } = require("grammy");

module.exports = (bot) => {
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
      console.error("Grammy error:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Request error:", e.response.status_code, e.response.body);
    } else {
      console.error("Unknown error:", e);
    }
  });
};
