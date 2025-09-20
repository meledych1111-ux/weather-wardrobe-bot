const fs = require('fs').promises;
const path = require('path');

const PREFERENCES_FILE = path.join(__dirname, '../data/userPreferences.json');

class PreferenceService {
  constructor() {
    this.preferences = {};
    this.loadPreferences();
  }

  async loadPreferences() {
    try {
      const data = await fs.readFile(PREFERENCES_FILE, 'utf8');
      this.preferences = JSON.parse(data);
      console.log('✅ User preferences loaded');
    } catch (error) {
      this.preferences = {};
      await this.savePreferences();
    }
  }

  async savePreferences() {
    try {
      await fs.mkdir(path.dirname(PREFERENCES_FILE), { recursive: true });
      await fs.writeFile(PREFERENCES_FILE, JSON.stringify(this.preferences, null, 2));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  getUserPreferences(userId) {
    return this.preferences[userId] || { 
      clothingPreferences: [], 
      likedOutfits: [], 
      location: null 
    };
  }

  async saveUserPreference(userId, preference) {
    if (!this.preferences[userId]) {
      this.preferences[userId] = { 
        clothingPreferences: [], 
        likedOutfits: [], 
        location: null 
      };
    }

    if (preference.location) {
      this.preferences[userId].location = preference.location;
    }

    if (preference.clothingPreference) {
      this.preferences[userId].clothingPreferences.push({
        ...preference.clothingPreference,
        timestamp: new Date().toISOString()
      });
    }

    if (preference.likedOutfit) {
      this.preferences[userId].likedOutfits.push(preference.likedOutfit);
    }

    await this.savePreferences();
  }

  async getRecommendedOutfit(userId, weatherData) {
    const userPrefs = this.getUserPreferences(userId);
    const recentPrefs = userPrefs.clothingPreferences
      .filter(pref => new Date(pref.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .filter(pref => Math.abs(pref.temperature - weatherData.temperature) <= 5);

    if (recentPrefs.length > 0) {
      return `⭐ Based on your preferences:\n${recentPrefs[0].outfit}`;
    }

    return weatherData.advice;
  }
}

module.exports = new PreferenceService();