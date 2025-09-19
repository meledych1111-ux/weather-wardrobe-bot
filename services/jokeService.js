const axios = require('axios');

class JokeService {
  async getRandomJoke() {
    try {
      const response = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=ru');
      
      if (response.data.type === 'single') {
        return response.data.joke;
      } else {
        return `${response.data.setup}\n\n...\n\n${response.data.delivery}`;
      }
    } catch (error) {
      return 'Почему программисты не любят природу? \n\n...\n\nВ ней слишком много багов! 🐛';
    }
  }
}

module.exports = new JokeService();
