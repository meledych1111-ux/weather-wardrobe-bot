const preferenceService = require('../services/preferenceService');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.setupMessageHandling();
  }

  setupMessageHandling() {
    this.bot.on('message', (msg) => this.handleMessage(msg));
  }

  async handleMessage(msg) {
    if (msg.text && !msg.text.startsWith('/')) {
      await this.handleTextMessage(msg);
    }
  }

  async handleTextMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text.toLowerCase();

    if (text.includes('нравится') || text.includes('like')) {
      const prefs = preferenceService.getUserPreferences(chatId);
      if (prefs.clothingPreferences.length > 0) {
        const lastPreference = prefs.clothingPreferences[prefs.clothingPreferences.length - 1];
        await preferenceService.saveUserPreference(chatId, {
          likedOutfit: lastPreference.outfit
        });
        await this.bot.sendMessage(chatId, '✅ Отлично! Сохранил твой выбор в понравившиеся!');
      }
    } else if (text.includes('не нравится') || text.includes('dislike')) {
      await this.bot.sendMessage(chatId, '👌 Понял, учту в будущих рекомендациях!');
    } else if (text.length > 2) {
      await this.bot.sendMessage(chatId, `🌤️ Ищу погоду для: ${msg.text}...`);
      this.bot.emit('text', { ...msg, text: `/weather ${msg.text}` });
    }
  }
}

module.exports = MessageHandler;