const axios = require('axios');
const { JOKE_API_URL } = require('../config/constants');

class JokeService {
  async getRandomJoke() {
    try {
      const response = await axios.get(JOKE_API_URL, { timeout: 5000 });
      return `${response.data.setup}\n\n💥 ${response.data.punchline}`;
    } catch (error) {
      console.error('Joke API error:', error);
      return this.getFallbackJoke();
    }
  }

  getFallbackJoke() {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you call a fake noodle? An impasta!",
      "How does a penguin build its house? Igloos it together!",
      "Why did the math book look sad? Because it had too many problems!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
}

module.exports = new JokeService();