const axios = require('axios');
const { weatherApiKey } = require('../config/keys');

class WeatherService {
  async getWeather(city) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=ru`
      );
      
      return this.formatWeatherData(response.data);
    } catch (error) {
      throw new Error('Не удалось получить данные о погоде. Проверьте название города.');
    }
  }

  formatWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const city = data.name;

    return {
      city,
      temp,
      feelsLike,
      humidity,
      windSpeed,
      description,
      advice: this.generateClothingAdvice(temp, description)
    };
  }

  generateClothingAdvice(temp, description) {
    let advice = '';
    
    if (temp <= -10) {
      advice = '❄️ Одевайтесь очень тепло: пуховик, термобелье, шапка, шарф, перчатки';
    } else if (temp <= 0) {
      advice = '⛄️ Теплая одежда: зимняя куртка, шапка, шарф';
    } else if (temp <= 10) {
      advice = '🍂 Легкая куртка или пальто, джинсы, закрытая обувь';
    } else if (temp <= 20) {
      advice = '🌤️ Легкая кофта или ветровка, длинные брюки';
    } else {
      advice = '☀️ Легкая одежда: футболка, шорты, панама от солнца';
    }

    if (description.includes('дождь')) {
      advice += ', не забудьте зонт! ☔';
    } else if (description.includes('снег')) {
      advice += ', waterproof обувь рекомендована!';
    } else if (description.includes('солн')) {
      advice += ', солнцезащитные очки будут кстати! 😎';
    }

    return advice;
  }
}

module.exports = new WeatherService();
