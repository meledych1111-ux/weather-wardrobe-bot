const weatherService = require('../services/weatherService');
const englishService = require('../services/englishService');
const jokeService = require('../services/jokeService');
const preferenceService = require('../services/preferenceService');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
  }

  handleStart(message) {
    const chatId = message.chat.id;
    const welcomeText = `👋 Привет, ${message.from.first_name}!

Я твой персональный помощник по стилю и погоде! Вот что я умею:

🌤️  /weather - Погода и советы по одежде
📚  /english - 5 английских фраз на сегодня
😂  /joke - Случайная шутка
❤️  /preferences - Мои предпочтения
ℹ️   /help - Помощь по командам

Просто напиши название города, и я расскажу о погоде и подскажу что надеть!`;

    this.bot.sendMessage(chatId, welcomeText);
  }

  async handleWeather(message, city = null) {
    const chatId = message.chat.id;
    
    if (!city) {
      this.bot.sendMessage(chatId, 'Напиши название города после команды, например: /weather Москва');
      return;
    }

    try {
      this.bot.sendMessage(chatId, '🌤️ Запрашиваю погоду...');
      
      const weather = await weatherService.getWeather(city);
      await preferenceService.addCityPreference(chatId, city);

      const response = `🌍 Погода в ${weather.city}:
🌡️ Температура: ${weather.temp}°C (ощущается как ${weather.feelsLike}°C)
💨 Ветер: ${weather.windSpeed} м/с
💧 Влажность: ${weather.humidity}%
📝 Описание: ${weather.description}

👔 Совет по одежде: ${weather.advice}`;

      this.bot.sendMessage(chatId, response);
    } catch (error) {
      this.bot.sendMessage(chatId, error.message);
    }
  }

  async handleEnglish(message) {
    const chatId = message.chat.id;
    
    try {
      const phrases = await englishService.getDailyPhrases();
      let response = '🌟 *5 английских фраз на сегодня с переводами:*\n\n';

      phrases.forEach((phrase, index) => {
        response += englishService.formatPhrase(phrase, index);
        response += '\n';
      });

      response += '\n💡 *Совет:* Попробуйте использовать эти фразы сегодня в разговоре!';

      this.bot.sendMessage(chatId, response, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
    } catch (error) {
      console.error('English command error:', error);
      this.bot.sendMessage(chatId, '❌ Не удалось загрузить фразы. Попробуйте позже.');
    }
  }

  async handleJoke(message) {
    const chatId = message.chat.id;
    
    try {
      const joke = await jokeService.getRandomJoke();
      this.bot.sendMessage(chatId, `😂 Шутка дня:\n\n${joke}`);
    } catch (error) {
      this.bot.sendMessage(chatId, 'Шутки кончились! Попробуйте позже 😄');
    }
  }

  async handlePreferences(message) {
    const chatId = message.chat.id;
    const prefs = preferenceService.getUserPreferences(chatId);

    let response = '❤️ Ваши предпочтения:\n\n';

    if (prefs.preferredCities.length > 0) {
      response += '🏙️ Часто ищете погоду в:\n';
      prefs.preferredCities.forEach(city => {
        response += `   - ${city}\n`;
      });
      response += '\n';
    }

    if (prefs.clothingPreferences.length > 0) {
      response += '👔 История ваших выборов одежды:\n';
      prefs.clothingPreferences.slice(-5).forEach((pref, index) => {
        response += `   ${index + 1}. При ${pref.temperature}°C: ${pref.clothing}\n`;
      });
    } else {
      response += 'У вас пока нет сохраненных предпочтений одежды. Я буду запоминать ваши выборы!';
    }

    this.bot.sendMessage(chatId, response);
  }

  handleHelp(message) {
    const chatId = message.chat.id;
    const helpText = `ℹ️ Доступные команды:

/start - Начать работу
/weather [город] - Погода и советы по одежде
/english - 5 английских фраз на сегодня
/joke - Случайная шутка
/preferences - Мои предпочтения
/help - Эта справка

💡 Просто напишите название города, и я автоматически покажу погоду!`;

    this.bot.sendMessage(chatId, helpText);
  }
}

module.exports = CommandHandler;
