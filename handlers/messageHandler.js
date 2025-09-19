const weatherService = require('../services/weatherService');
const preferenceService = require('../services/preferenceService');

class MessageHandler {
  constructor(bot, commandHandler) {
    this.bot = bot;
    this.commandHandler = commandHandler;
  }

  async handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text.trim();

    // Если сообщение похоже на город
    if (/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(text) && text.length > 1 && text.length < 50) {
      await this.handleCityMessage(message, text);
    }
  }

  async handleCityMessage(message, city) {
    const chatId = message.chat.id;
    
    try {
      this.bot.sendMessage(chatId, `🌤️ Ищу погоду для ${city}...`);
      
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
      this.bot.sendMessage(chatId, `Не удалось найти погоду для "${city}". Попробуйте другой город.`);
    }
  }
}

module.exports = MessageHandler;
