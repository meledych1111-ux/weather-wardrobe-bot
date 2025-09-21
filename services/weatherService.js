const axios = require('axios');
const { WEATHERAPI_URL, SEVASTOPOL_LOCATION, CLOTHING_ADVICE } = require('../config/constants');
const { WEATHERAPI_KEY } = require('../config/keys');

class WeatherService {
  async getWeather() {
    try {
      console.log('🌤️ Fetching weather for Sevastopol...');
      
      const response = await axios.get(
        `${WEATHERAPI_URL}?key=${WEATHERAPI_KEY}&q=Sevastopol&lang=ru`,
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('✅ Weather API response received');
      
      const weather = response.data;
      const temp = weather.current.temp_c;
      const condition = weather.current.condition.text;
      const advice = this.getClothingAdvice(temp);
      
      return {
        temperature: Math.round(temp),
        description: condition,
        city: weather.location.name,
        advice: advice
      };
    } catch (error) {
      console.error('❌ WeatherAPI error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
      throw new Error('Не удалось получить данные о погоде. Проверьте API ключ.');
    }
  }

  getClothingAdvice(temp) {
    if (temp >= 30) return CLOTHING_ADVICE.hot;
    if (temp >= 20) return CLOTHING_ADVICE.warm;
    if (temp >= 10) return CLOTHING_ADVICE.cool;
    if (temp >= 0) return CLOTHING_ADVICE.cold;
    return CLOTHING_ADVICE.freezing;
  }
}

module.exports = new WeatherService();