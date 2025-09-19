const Parser = require('rss-parser');
const axios = require('axios');
const { rssFeedUrl } = require('../config/keys');

class EnglishService {
  constructor() {
    this.parser = new Parser();
    this.phrases = [];
    this.lastUpdate = null;
  }

  async getDailyPhrases() {
    const now = new Date();
    if (!this.lastUpdate || now - this.lastUpdate > 24 * 60 * 60 * 1000) {
      await this.loadPhrases();
      this.lastUpdate = now;
    }
    return this.phrases.slice(0, 5);
  }

  async loadPhrases() {
    try {
      const feed = await this.parser.parseURL(rssFeedUrl);
      
      // Берем первые 5 фраз
      const items = feed.items.slice(0, 5);
      
      this.phrases = await Promise.all(
        items.map(async (item, index) => {
          // Задержка между запросами чтобы не превысить лимиты API
          await this.delay(index * 1000);
          
          const word = item.title || "New Word";
          const definition = this.extractDefinition(item.description);
          const example = item.contentSnippet || "Example sentence";

          return {
            word: word,
            definition: definition,
            example: example,
            translation: await this.translateText(word),
            definitionTranslation: await this.translateText(definition),
            exampleTranslation: await this.translateText(example),
            link: item.link
          };
        })
      );

      console.log('✅ 5 английских фраз загружены с переводами');

    } catch (error) {
      console.error('Error loading phrases:', error);
      this.phrases = this.getFallbackPhrases();
    }
  }

  async translateText(text) {
    if (!text || text.length > 500) return text; // Защита от длинных текстов
    
    try {
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: 'en|ru'
        },
        timeout: 5000
      });
      
      return response.data.responseData.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Возвращаем оригинал при ошибке
    }
  }

  extractDefinition(description) {
    const patterns = [
      /noun:\s*(.*?)(?:\.|$)/i,
      /verb:\s*(.*?)(?:\.|$)/i, 
      /adjective:\s*(.*?)(?:\.|$)/i,
      /adverb:\s*(.*?)(?:\.|$)/i
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getFallbackPhrases() {
    return [
      {
        word: "Serendipity",
        definition: "The occurrence of events by chance in a happy way",
        example: "Finding your favorite book was pure serendipity.",
        translation: "Серендипити",
        definitionTranslation: "Случайное счастливое происшествие",
        exampleTranslation: "Найти вашу любимую книгу было чистой серендипити.",
        link: "https://wordsmith.org/words/serendipity.html"
      },
      {
        word: "Ephemeral", 
        definition: "Lasting for a very short time",
        example: "The beauty of cherry blossoms is ephemeral.",
        translation: "Мимолетный",
        definitionTranslation: "Длящийся очень короткое время",
        exampleTranslation: "Красота цветения сакуры мимолетна.",
        link: "https://wordsmith.org/words/ephemeral.html"
      }
    ];
  }

  formatPhrase(phrase, index) {
    return `${index + 1}. **${phrase.word}** - _${phrase.translation}_\n` +
           `   📖 ${phrase.definition}\n` +
           `   🇷🇺 ${phrase.definitionTranslation}\n` +
           `   💬 "${phrase.example}"\n` +
           `   🇷🇺 "${phrase.exampleTranslation}"\n` +
           `   🔗 [Подробнее](${phrase.link})\n`;
  }
}

module.exports = new EnglishService();
