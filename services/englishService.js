const fs = require('fs').promises;
const path = require('path');

const PHRASES_FILE = path.join(__dirname, '../data/phrases/english-phrases.json');

class EnglishService {
  constructor() {
    this.phrases = {};
    this.loadPhrases();
  }

  async loadPhrases() {
    try {
      console.log('📖 Loading English phrases from JSON...');
      const data = await fs.readFile(PHRASES_FILE, 'utf8');
      this.phrases = JSON.parse(data);
      console.log('✅ English phrases loaded successfully');
    } catch (error) {
      console.error('❌ Error loading phrases from JSON:', error.message);
      this.phrases = this.getFallbackPhrases();
    }
  }

  getFallbackPhrases() {
    return {
      travel: [
        {
          en: "Where is the nearest hotel?",
          ru: "Где ближайший отель?",
          transcription: "[вэр из зэ нээрист хоутел?]",
          category: "travel"
        }
      ],
      office: [
        {
          en: "I need to finish this report",
          ru: "Мне нужно закончить этот отчет",
          transcription: "[ай нид ту финиш зис рипорт]",
          category: "office"
        }
      ],
      business: [
        {
          en: "We need to align our strategy",
          ru: "Нам нужно согласовать стратегию",
          transcription: "[ви нид ту элайн аур стрэтеджи]",
          category: "business"
        }
      ]
    };
  }

  getDailyPhrases(category = 'travel') {
    // Берем день года для постоянства в течение дня
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    
    const allPhrases = this.phrases[category] || [];
    
    if (allPhrases.length === 0) {
      return this.getFallbackPhrases()[category] || [];
    }

    // Выбираем 5 фраз на основе дня года
    const dailyPhrases = [];
    const phrasesCount = Math.min(5, allPhrases.length);
    
    for (let i = 0; i < phrasesCount; i++) {
      const index = (dayOfYear + i) % allPhrases.length;
      dailyPhrases.push(allPhrases[index]);
    }
    
    console.log(`📅 Daily phrases for ${category}: ${dailyPhrases.length} phrases`);
    return dailyPhrases;
  }

  getAllPhrases(category = 'travel') {
    return this.phrases[category] || this.getFallbackPhrases()[category] || [];
  }

  getAvailableCategories() {
    const categories = Object.keys(this.phrases);
    return categories.length > 0 ? categories : ['travel', 'office', 'business'];
  }

  async addPhrase(category, phraseData) {
    if (!this.phrases[category]) {
      this.phrases[category] = [];
    }
    
    this.phrases[category].push({
      ...phraseData,
      category: category
    });

    await this.savePhrases();
  }

  async savePhrases() {
    try {
      await fs.writeFile(PHRASES_FILE, JSON.stringify(this.phrases, null, 2));
      console.log('✅ Phrases saved to JSON file');
    } catch (error) {
      console.error('❌ Error saving phrases:', error);
    }
  }
}

module.exports = new EnglishService();