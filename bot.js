const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const { TELEGRAM_TOKEN } = require('./config/keys');
const CommandHandler = require('./handlers/commandHandler');
const MessageHandler = require('./handlers/messageHandler');
const englishService = require('./services/englishService');

console.log('🚀 Starting Weather Wardrobe Bot...');

const bot = new TelegramBot(TELEGRAM_TOKEN, { 
  polling: true,
  onlyFirstMatch: true
});

new CommandHandler(bot);
new MessageHandler(bot);

cron.schedule('0 9 * * *', async () => {
  console.log('📚 Loading daily English phrases...');
  await englishService.loadDailyPhrases();
});

bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('⚠️ Unhandled Rejection:', error);
});

console.log('✅ Bot started successfully!');