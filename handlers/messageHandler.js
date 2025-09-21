const preferenceService = require('../services/preferenceService');
const englishService = require('../services/englishService');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.setupMessageHandling();
  }

  setupMessageHandling() {
    this.bot.on('message', (msg) => this.handleMessage(msg));
  }

  async handleMessage(msg) {
    if (msg.text && msg.text.startsWith('/')) {
      return; // Пропускаем команды
    }

    if (msg.text && !msg.text.startsWith('/')) {
      await this.handleTextMessage(msg);
    }
  }

  async handleTextMessage(msg) {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    console.log(`📩 Received text message: "${text}"`);

    try {
      // Обработка кнопок главного меню
      switch(text) {
        case '🌤️ Погода в Севастополе':
          await this.handleWeatherCommand(chatId);
          break;
        case '📚 Английские фразы':
          await this.handleEnglishPhrasesMenu(chatId);
          break;
        case '⭐ Мои предпочтения':
          await this.handlePreferencesCommand(chatId);
          break;
        case '❓ Помощь':
          await this.handleHelpCommand(chatId);
          break;
        case '↩️ Назад в меню':
          await this.showMainMenu(chatId);
          break;
        default:
          await this.handleLegacyTextCommands(chatId, text.toLowerCase());
      }
    } catch (error) {
      console.error('Error handling text message:', error);
      await this.bot.sendMessage(chatId, '❌ Произошла ошибка при обработке запроса');
    }
  }

  // Показать главное меню
  async showMainMenu(chatId) {
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
    
    await this.bot.sendMessage(chatId, 
      '🏠 *Главное меню*\n\nВыберите действие:', 
      { parse_mode: 'Markdown', reply_markup: keyboard.reply_markup }
    );
  }

  async handleWeatherCommand(chatId) {
    await this.bot.sendMessage(chatId, `🌤️ Загружаю погоду для Севастополя...`);
    this.bot.emit('text', { 
      chat: { id: chatId }, 
      text: '/weather',
      from: { first_name: 'User' }
    });
  }

  async handleEnglishPhrasesMenu(chatId) {
    const keyboard = {
      reply_markup: {
        keyboard: [
          ['🏖️ Travel фразы', '🏢 Office фразы'],
          ['💼 Business фразы', '↩️ Назад в меню']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    };
    
    await this.bot.sendMessage(chatId, 
      '📚 *Выберите категорию английских фраз:*\n\n' +
      '🏖️ Travel - Фразы для путешествий\n' +
      '🏢 Office - Офисные выражения\n' +
      '💼 Business - Деловое общение', 
      { parse_mode: 'Markdown', reply_markup: keyboard.reply_markup }
    );
  }

  async handlePreferencesCommand(chatId) {
    this.bot.emit('text', { 
      chat: { id: chatId }, 
      text: '/preferences',
      from: { first_name: 'User' }
    });
  }

  async handleHelpCommand(chatId) {
    this.bot.emit('text', { 
      chat: { id: chatId }, 
      text: '/help',
      from: { first_name: 'User' }
    });
  }

  async handleLegacyTextCommands(chatId, text) {
    if (text.includes('нравится') || text.includes('like')) {
      await this.handleLike(chatId);
    } else if (text.includes('не нравится') || text.includes('dislike')) {
      await this.handleDislike(chatId);
    } else if (text.includes('погода')) {
      await this.handleWeatherCommand(chatId);
    } else if (text === 'travel') {
      await this.handleEnglishPhrases(chatId, 'travel');
    } else if (text === 'office') {
      await this.handleEnglishPhrases(chatId, 'office');
    } else if (text === 'business') {
      await this.handleEnglishPhrases(chatId, 'business');
    } else {
      await this.bot.sendMessage(chatId, 'Не понимаю команду. Используйте меню 👇');
    }
  }

  async handleLike(chatId) {
    const prefs = preferenceService.getUserPreferences(chatId);
    if (prefs.clothingPreferences.length > 0) {
      const lastPreference = prefs.clothingPreferences[prefs.clothingPreferences.length - 1];
      await preferenceService.saveUserPreference(chatId, {
        likedOutfit: lastPreference.outfit
      });
      await this.bot.sendMessage(chatId, '✅ Отлично! Сохранил ваш выбор!');
    }
  }

  async handleDislike(chatId) {
    await this.bot.sendMessage(chatId, '👌 Понял, учту в будущих рекомендациях!');
  }

  async handleEnglishPhrases(chatId, category) {
    const phrases = englishService.getDailyPhrases(category);
    if (!phrases || phrases.length === 0) {
      await this.bot.sendMessage(chatId, `❌ Фразы в категории "${category}" не найдены`);
      return;
    }

    let message = `📚 *Английские фразы (${category}) на сегодня:*\n\n`;
    phrases.forEach((phrase, index) => {
      message += `${index + 1}. ${phrase.en}\n` +
                 `   - ${phrase.ru}\n` +
                 `   - ${phrase.transcription}\n\n`;
    });

    message += `📅 *Завтра будут новые фразы!*`;

    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

module.exports = MessageHandler;