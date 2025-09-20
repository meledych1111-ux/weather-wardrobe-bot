const weatherService = require('../services/weatherService');
const englishService = require('../services/englishService');
const jokeService = require('../services/jokeService');
const preferenceService = require('../services/preferenceService');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.setupCommands();
  }

  setupCommands() {
    this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
    this.bot.onText(/\/weather (.+)/, (msg, match) => this.handleWeather(msg, match));
    this.bot.onText(/\/english/, (msg) => this.handleEnglish(msg));
    this.bot.onText(/\/joke/, (msg) => this.handleJoke(msg));
    this.bot.onText(/\/preferences/, (msg) => this.handlePreferences(msg));
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));
  }

  async handleStart(msg) {
    const chatId = msg.chat.id;
    const welcomeMessage = `👋 Привет, ${msg.from.first_name}!

Я твой умный помощник для:
🌤️ Погоды и советов по одежде
📚 Изучения английского
😄 Развлечения с шутками

Доступные команды:
/weather [город] - Погода и советы
/english - 5 английских фраз
/joke - Случайная шутка
/preferences - Мои предпочтения
/help - Помощь

Просто напиши мне название города для погоды!`;

    await this.bot.sendMessage(chatId, welcomeMessage);
  }

  async handleWeather(msg, match) {
    const chatId = msg.chat.id;
    const city = match[1];

    try {
      const weather = await weatherService.getWeather(city);
      const recommendation = await preferenceService.getRecommendedOutfit(chatId, weather);

      const message = `🌤️ Погода в ${weather.city}:
Температура: ${weather.temperature}°C
Описание: ${weather.description}

👕 Совет по одежде:
${recommendation}

💡 Сохранить этот выбор? Ответь "нравится" или "не нравится"`;

      await this.bot.sendMessage(chatId, message);
      
      await preferenceService.saveUserPreference(chatId, { 
        location: city,
        clothingPreference: {
          temperature: weather.temperature,
          outfit: recommendation,
          weather: weather.description
        }
      });

    } catch (error) {
      await this.bot.sendMessage(chatId, '❌ Не удалось получить погоду. Проверь название города.');
    }
  }

  async handleEnglish(msg) {
    const chatId = msg.chat.id;
    const phrases = englishService.getDailyPhrases();

    let message = '📚 5 английских фраз на сегодня:\n\n';
    phrases.forEach((phrase, index) => {
      message += `${index + 1}. **${phrase.word}**\n   - ${phrase.meaning}\n\n`;
    });

    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  async handleJoke(msg) {
    const chatId = msg.chat.id;
    const joke = await jokeService.getRandomJoke();

    await this.bot.sendMessage(chatId, `😄 ${joke}`);
  }

  async handlePreferences(msg) {
    const chatId = msg.chat.id;
    const prefs = preferenceService.getUserPreferences(chatId);

    let message = '⭐ Твои предпочтения:\n\n';
    message += `📍 Местоположение: ${prefs.location || 'Не указано'}\n\n`;
    message += `❤️ Сохраненных выборов: ${prefs.clothingPreferences.length}\n`;
    message += `👍 Понравившихся outfit'ов: ${prefs.likedOutfits.length}`;

    await this.bot.sendMessage(chatId, message);
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;
    const helpMessage = `ℹ️ Доступные команды:

/weather [город] - Узнать погоду и получить совет по одежде
/english - Получить 5 английских фраз на сегодня
/joke - Случайная шутка
/preferences - Посмотреть свои предпочтения
/help - Эта справка

Просто напиши название города для быстрого доступа к погоде!`;

    await this.bot.sendMessage(chatId, helpMessage);
  }
}

module.exports = CommandHandler;