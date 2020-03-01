import Telegraf from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/telegram-types';

import { valuesEncoder, valuesDecoder } from './coreValuesEncoder';

function botStart(botToken: string, agent?: any) {
  const bot = new Telegraf(botToken, {
    telegram: {
      agent,
    },
  });

  bot.start((ctx) => ctx.reply('Welcome'));
  bot.help((ctx) => ctx.reply('Send me a sticker'));
  bot.hears('hi', (ctx) => ctx.reply('Hey there'));
  bot.on('inline_query', (ctx) => {
    const originalText = ctx.inlineQuery?.query || '';
    // console.log('got inline query');
    // console.log(originalText);
    const result: InlineQueryResult[] = [];
    if (originalText) {
      const encoded = valuesEncoder(originalText);
      result.push({
        type: 'article',
        id: `${Date.now()}${Math.trunc(Math.random() * 1e6)}`,
        title: encoded,
        input_message_content: {
          message_text: encoded,
        },
        reply_markup: {
          inline_keyboard: [[{
            text: 'Decode',
            callback_data: originalText,
          }]]
        }
      });
    }
    // Using context shortcut
    ctx.answerInlineQuery(result);
  });
  bot.on('callback_query', (ctx) => {
    const originalText = ctx.update.callback_query?.data || '';
    // console.log('got cb query')
    // console.log(originalText);
    // Using context shortcut
    ctx.answerCbQuery(originalText, true);
  })
  bot.launch();
}

export default botStart;
