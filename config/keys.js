require('dotenv').config();

module.exports = {
  telegramToken: process.env.TELEGRAM_TOKEN,
  weatherApiKey: process.env.WEATHER_API_KEY,
  rssFeedUrl: process.env.RSS_FEED_URL || 'https://wordsmith.org/awad/rss1.xml'
};
