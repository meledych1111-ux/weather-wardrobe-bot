const axios = require('axios');
const { WEATHER_API_KEY, WEATHER_BASE_URL } = require('../config/constants');
const { CLOTHING_ADVICE } = require('../config/constants');

class WeatherService {
  async getWeather(city) {
    try {
      const response = await axios.get(
        `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=ru`
      );
      
      const weather = response.data;
      const advice = this.getClothingAdvice(weather.main.temp);
      
      return {
        temperature: Math.round(weather.main.temp),
        description: weather.weather[0].description,
        city: weather.name,
        advice: advice
      };
    } catch (error) {
      console.error('Weather API error:', error.response?.data);
      throw new Error('Не удалось получить данные о погоде');
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