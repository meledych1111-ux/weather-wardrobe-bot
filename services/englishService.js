const Parser = require('rss-parser');
const parser = new Parser();
const { RSS_FEED_URL } = require('../config/keys');

class EnglishService {
  constructor() {
    this.phrases = [];
    this.lastUpdate = null;
    this.loadDailyPhrases();
  }

  async loadDailyPhrases() {
    try {
      const feed = await parser.parseURL(RSS_FEED_URL);
      this.phrases = feed.items.slice(0, 5).map(item => ({
        word: item.title,
        meaning: item.contentSnippet || item.content
      }));
      this.lastUpdate = new Date();
      console.log('✅ English phrases loaded successfully');
    } catch (error) {
      console.error('Error loading phrases:', error);
      this.phrases = this.getFallbackPhrases();
    }
  }

  getFallbackPhrases() {
    return [
      { word: "Serendipity", meaning: "The occurrence of events by chance in a happy or beneficial way" },
      { word: "Ephemeral", meaning: "Lasting for a very short time" },
      { word: "Quintessential", meaning: "Representing the most perfect or typical example of a quality or class" },
      { word: "Melancholy", meaning: "A feeling of pensive sadness, typically with no obvious cause" },
      { word: "Resilience", meaning: "The capacity to recover quickly from difficulties" }
    ];
  }

  getDailyPhrases() {
    if (!this.phrases.length || this.isNewDay()) {
      this.loadDailyPhrases();
    }
    return this.phrases;
  }

  isNewDay() {
    if (!this.lastUpdate) return true;
    const now = new Date();
    return now.toDateString() !== this.lastUpdate.toDateString();
  }
}

module.exports = new EnglishService();