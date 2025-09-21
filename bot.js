const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

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

// Главное кнопочное меню
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        reply_markup: {
            keyboard: [
                ['🌤️ Погода в Севастополе', '📚 Английские фразы'],
                ['⭐ Мои предпочтения', '❓ Помощь']
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    };
    
    bot.sendMessage(chatId, 
        '👋 Добро пожаловать в *Weather Wardrobe Bot*!\n\n' +
        '✨ *Что я умею:*\n' +
        '🌤️ Показывать погоду в Севастополе\n' +
        '👕 Давать рекомендации по одежде\n' +
        '📚 Обучать английским фразам\n' +
        '💾 Сохранять ваши предпочтения\n\n' +
        'Выберите действие из меню ниже 👇', 
        { 
            parse_mode: 'Markdown',
            reply_markup: keyboard.reply_markup 
        }
    );
});

// Установка команд меню для BotFather
bot.setMyCommands([
    { command: 'start', description: 'Главное меню' },
    { command: 'weather', description: 'Погода в Севастополе' },
    { command: 'phrases', description: 'Английские фразы' },
    { command: 'preferences', description: 'Мои предпочтения' },
    { command: 'help', description: 'Помощь' }
]);

new CommandHandler(bot);
new MessageHandler(bot);

cron.schedule('0 9 * * *', async () => {
  console.log('📚 Reloading English phrases...');
  await englishService.loadPhrases();
});

bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('⚠️ Unhandled Rejection:', error);
});

console.log('✅ Bot started successfully!');