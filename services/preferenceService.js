const fs = require('fs').promises;
const path = require('path');

class PreferenceService {
  constructor() {
    this.preferencesFile = path.join(__dirname, '../data/userPreferences.json');
    this.userPreferences = new Map();
    this.loadPreferences();
  }

  async loadPreferences() {
    try {
      const data = await fs.readFile(this.preferencesFile, 'utf8');
      const preferences = JSON.parse(data);
      
      for (const [chatId, prefs] of Object.entries(preferences)) {
        this.userPreferences.set(chatId, prefs);
      }
      
      console.log('✅ User preferences loaded');
    } catch (error) {
      console.log('ℹ️ No existing preferences file, starting fresh');
      // Создаем пустой файл с правильной структурой
      await this.saveAllPreferences();
    }
  }

  async saveAllPreferences() {
    const data = Object.fromEntries(this.userPreferences);
    try {
      await fs.mkdir(path.dirname(this.preferencesFile), { recursive: true });
      await fs.writeFile(this.preferencesFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Error saving preferences:', error);
    }
  }

  getUserPreferences(chatId) {
    if (!this.userPreferences.has(chatId)) {
      return {
        location: 'Sevastopol',
        clothingPreferences: [],
        likedOutfits: [],
        dislikedOutfits: [],
        lastUpdated: new Date().toISOString()
      };
    }
    return this.userPreferences.get(chatId);
  }

  async saveUserPreference(chatId, preference) {
    const currentPrefs = this.getUserPreferences(chatId);
    
    const updatedPrefs = {
      ...currentPrefs,
      ...preference,
      lastUpdated: new Date().toISOString()
    };

    if (preference.clothingPreference) {
      updatedPrefs.clothingPreferences = [
        ...currentPrefs.clothingPreferences,
        {
          ...preference.clothingPreference,
          timestamp: new Date().toISOString()
        }
      ];
    }

    if (preference.likedOutfit) {
      updatedPrefs.likedOutfits = [
        ...currentPrefs.likedOutfits,
        {
          outfit: preference.likedOutfit,
          timestamp: new Date().toISOString()
        }
      ];
    }

    this.userPreferences.set(chatId, updatedPrefs);
    await this.saveAllPreferences();
    
    return updatedPrefs;
  }

  async getRecommendedOutfit(chatId, weather) {
    const userPrefs = this.getUserPreferences(chatId);
    
    // Если у пользователя есть понравившиеся outfit'ы, используем их
    if (userPrefs.likedOutfits && userPrefs.likedOutfits.length > 0) {
      const lastLikedOutfit = userPrefs.likedOutfits[userPrefs.likedOutfits.length - 1];
      return `⭐ Based on your preferences:\n${lastLikedOutfit.outfit}`;
    }

    // Иначе используем базовые рекомендации по температуре
    const temp = weather.temperature;
    
    if (temp >= 30) return '👕 Легкая футболка, шорты, сандалии';
    if (temp >= 20) return '👔 Футболка, джинсы и легкая куртка';
    if (temp >= 10) return '🧥 Теплая кофта, джинсы и ветровка';
    if (temp >= 0) return '🧤 Теплое пальто, шапка и шарф';
    return '🧥❄️ Термобелье, пуховик, теплые ботинки';
  }

  // Новый метод для очистки старых записей
  async cleanupOldPreferences(chatId, maxEntries = 50) {
    const prefs = this.getUserPreferences(chatId);
    
    if (prefs.clothingPreferences.length > maxEntries) {
      prefs.clothingPreferences = prefs.clothingPreferences.slice(-maxEntries);
      this.userPreferences.set(chatId, prefs);
      await this.saveAllPreferences();
    }
  }
}

module.exports = new PreferenceService();