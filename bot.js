const TelegramBot = require('node-telegram-bot-api');
const { telegramToken } = require('./config/keys');
const CommandHandler = require('./handlers/commandHandler');
const MessageHandler = require('./handlers/messageHandler');
const englishService = require('./services/englishService');

// Инициализация бота
const bot = new TelegramBot(telegramToken, { polling: true });
const commandHandler = new CommandHandler(bot);
const messageHandler = new MessageHandler(bot, commandHandler);

console.log('🤖 Бот запущен...');

// Предзагрузка английских фраз
englishService.loadPhrases().then(() => {
  console.log('✅ Английские фразы готовы');
}).catch(console.error);

// Обработчики команд
bot.onText(/\/start/, (msg) => commandHandler.handleStart(msg));
bot.onText(/\/weather(?:\s+(.+))?/, (msg, match) => commandHandler.handleWeather(msg, match[1]));
bot.onText(/\/english/, (msg) => commandHandler.handleEnglish(msg));
bot.onText(/\/joke/, (msg) => commandHandler.handleJoke(msg));
bot.onText(/\/preferences/, (msg) => commandHandler.handlePreferences(msg));
bot.onText(/\/help/, (msg) => commandHandler.handleHelp(msg));

// Обработка обычных сообщений
bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
  messageHandler.handleMessage(msg);
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('Ошибка бота:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
