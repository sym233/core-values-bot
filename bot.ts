import { Telegraf } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

import { valuesEncoder, valuesDecoder } from './coreValuesEncoder';

function botStart(botToken: string, agent?: any) {
  const bot = new Telegraf(botToken, {
    telegram: {
      agent,
    },
  });

  bot.start(ctx => ctx.reply('Welcome'));
  bot.help(ctx => ctx.reply('Type "@CoreValuesBot [Text To Encode]"'));
  bot.hears('hi', ctx => ctx.reply('Hey there'));
  bot.on('inline_query', ctx => {
    const originalText = ctx.inlineQuery?.query as string ?? '';
    if (originalText && Buffer.from([originalText]).length < 63) {
      const encoded = valuesEncoder(originalText);
      const result: InlineQueryResult = {
        type: 'article',
        id: `${Date.now()}${Math.trunc(Math.random() * 1e6)}`,
        title: encoded,
        input_message_content: {
          message_text: encoded,
        },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Decode',
                callback_data: originalText,
              },
            ],
          ],
        },
      };
      ctx.answerInlineQuery([result]);
    } else {
      ctx.answerInlineQuery([]);
    }
  });
  bot.on('callback_query', ctx => {
    const originalText = ctx.update.callback_query?.data as string ?? '';
    // console.log('got cb query')
    // Using context shortcut
    ctx.answerCbQuery(originalText, { show_alert: true });
  });
  bot.launch().then(() => console.log('Started'));
}

export default botStart;
