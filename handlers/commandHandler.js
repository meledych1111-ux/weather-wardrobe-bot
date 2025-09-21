const weatherService = require('../services/weatherService');
const englishService = require('../services/englishService');
const preferenceService = require('../services/preferenceService');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.setupCommands();
  }

  setupCommands() {
    // Основные команды (БЕЗ /start!)
    this.bot.onText(/\/weather/, (msg) => this.handleWeather(msg));
    this.bot.onText(/\/phrases/, (msg) => this.handlePhrases(msg));
    this.bot.onText(/\/preferences/, (msg) => this.handlePreferences(msg));
    this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));

    // Команды категорий
    this.bot.onText(/\/travel/, (msg) => {
      console.log('🎯 Command: /travel');
      this.handleEnglishCategory(msg, 'travel');
    });
    
    this.bot.onText(/\/office/, (msg) => {
      console.log('🎯 Command: /office');
      this.handleEnglishCategory(msg, 'office');
    });
    
    this.bot.onText(/\/business/, (msg) => {
      console.log('🎯 Command: /business');
      this.handleEnglishCategory(msg, 'business');
    });
  }

  async handleWeather(msg) {
    const chatId = msg.chat.id;
    console.log('🌤️ /weather command received');

    try {
      const weather = await weatherService.getWeather();
      const recommendation = await preferenceService.getRecommendedOutfit(chatId, weather);

      const message = `🌤️ Погода в ${weather.city}:
Температура: ${weather.temperature}°C
Описание: ${weather.description}

👕 Совет по одежде:
${recommendation}

💡 Сохранить этот выбор? Ответь "нравится" или "не нравится"`;

      await this.bot.sendMessage(chatId, message);
      
      await preferenceService.saveUserPreference(chatId, { 
        location: 'Севастополь',
        clothingPreference: {
          temperature: weather.temperature,
          outfit: recommendation,
          weather: weather.description
        }
      });

    } catch (error) {
      console.error('❌ Weather error:', error.message);
      await this.bot.sendMessage(chatId, '❌ Не удалось получить погоду. Проверьте API ключ WeatherAPI.');
    }
  }

  async handlePhrases(msg) {
    const chatId = msg.chat.id;
    console.log('📚 /phrases command received');
    
    const message = `🎯 Выберите категорию фраз:\n\n
/travel - Путешествия ✈️
/office - Офис 🏢  
/business - Бизнес 💼

Или напишите:
• "travel"
• "office" 
• "business"

📅 Фразы обновляются каждый день!`;

    await this.bot.sendMessage(chatId, message);
  }

  async handleEnglishCategory(msg, category) {
    const chatId = msg.chat.id;
    console.log(`🎯 English category command: ${category}`);
    
    const phrases = englishService.getDailyPhrases(category);

    if (!phrases || phrases.length === 0) {
      await this.bot.sendMessage(chatId, `❌ Фразы в категории "${category}" не найдены`);
      return;
    }

    let message = `📚 Английские фразы (${category}) на сегодня:\n\n`;
    phrases.forEach((phrase, index) => {
      message += `${index + 1}. ${phrase.en}\n` +
                 `   - ${phrase.ru}\n` +
                 `   - ${phrase.transcription}\n\n`;
    });

    message += `📅 Завтра будут новые фразы!`;

    await this.bot.sendMessage(chatId, message);
  }

  async handlePreferences(msg) {
    const chatId = msg.chat.id;
    console.log('⭐ /preferences command received');
    
    const prefs = preferenceService.getUserPreferences(chatId);

    let message = '⭐ Твои предпочтения:\n\n';
    message += `📍 Местоположение: ${prefs.location || 'Не указано'}\n\n`;
    message += `❤️ Сохраненных выборов: ${prefs.clothingPreferences.length}\n`;
    message += `👍 Понравившихся outfit'ов: ${prefs.likedOutfits.length}`;

    await this.bot.sendMessage(chatId, message);
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;
    console.log('ℹ️ /help command received');
    
    const helpMessage = `ℹ️ Доступные команды:

/weather - Погода в Севастополе и совет по одежде
/phrases - Выбор категории английских фраз  
/preferences - Мои предпочтения
/help - Справка

Текстовые команды:
• "погода" - быстрый доступ к погоде
• "travel" - фразы для путешествий
• "office" - офисные фразы
• "business" - бизнес фразы

📅 Фразы обновляются каждый день!`;

    await this.bot.sendMessage(chatId, helpMessage);
  }
}

module.exports = CommandHandler;