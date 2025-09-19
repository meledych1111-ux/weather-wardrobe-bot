const fs = require('fs').promises;
const path = require('path');

class PreferenceService {
  constructor() {
    this.filePath = path.join(__dirname, '../data/userPreferences.json');
    this.preferences = {};
    this.loadPreferences();
  }

  async loadPreferences() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.preferences = JSON.parse(data);
    } catch (error) {
      this.preferences = {};
      await this.savePreferences();
    }
  }

  async savePreferences() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(this.preferences, null, 2));
  }

  getUserPreferences(userId) {
    return this.preferences[userId] || {
      preferredCities: [],
      clothingPreferences: [],
      lastSearches: []
    };
  }

  async addCityPreference(userId, city) {
    const userPrefs = this.getUserPreferences(userId);
    
    if (!userPrefs.preferredCities.includes(city)) {
      userPrefs.preferredCities.push(city);
      if (userPrefs.preferredCities.length > 5) {
        userPrefs.preferredCities.shift();
      }
    }

    this.preferences[userId] = userPrefs;
    await this.savePreferences();
  }

  async addClothingPreference(userId, temperature, clothing) {
    const userPrefs = this.getUserPreferences(userId);
    
    userPrefs.clothingPreferences.push({
      temperature,
      clothing,
      timestamp: new Date().toISOString()
    });

    if (userPrefs.clothingPreferences.length > 20) {
      userPrefs.clothingPreferences.shift();
    }

    this.preferences[userId] = userPrefs;
    await this.savePreferences();
  }
}

module.exports = new PreferenceService();
