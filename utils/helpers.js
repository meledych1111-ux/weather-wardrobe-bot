/**
 * Вспомогательные функции для бота
 */

/**
 * Форматирует температуру с знаком +/-
 * @param {number} temp - температура в градусах Цельсия
 * @returns {string} отформатированная температура
 */
function formatTemperature(temp) {
  return `${temp > 0 ? '+' : ''}${Math.round(temp)}°C`;
}

/**
 * Преобразует первую букву в заглавную
 * @param {string} str - входная строка
 * @returns {string} строка с заглавной первой буквой
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Форматирует описание погоды (убирает точку в конце если есть)
 * @param {string} description - описание погоды
 * @returns {string} отформатированное описание
 */
function formatWeatherDescription(description) {
  if (!description) return '';
  return description.replace(/\.$/, ''); // убираем точку в конце
}

/**
 * Создает прогресс-бар для визуализации
 * @param {number} current - текущее значение
 * @param {number} max - максимальное значение
 * @param {number} length - длина прогресс-бара
 * @returns {string} строковое представление прогресс-бара
 */
function createProgressBar(current, max, length = 10) {
  const percentage = Math.min(current / max, 1);
  const filledLength = Math.round(length * percentage);
  const emptyLength = length - filledLength;
  
  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);
  
  return `[${filled}${empty}] ${Math.round(percentage * 100)}%`;
}

/**
 * Форматирует дату в читаемый вид
 * @param {Date} date - объект Date
 * @returns {string} отформатированная дата
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Форматирует время в читаемый вид
 * @param {Date} date - объект Date
 * @returns {string} отформатированное время
 */
function formatTime(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Экранирует специальные символы для Markdown
 * @param {string} text - текст для экранирования
 * @returns {string} экранированный текст
 */
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

/**
 * Создает задержку на указанное время
 * @param {number} ms - время задержки в миллисекундах
 * @returns {Promise} промис, который resolves после задержки
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Валидирует email
 * @param {string} email - email для проверки
 * @returns {boolean} true если email валиден
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Обрезает текст до указанной длины и добавляет многоточие
 * @param {string} text - текст для обрезки
 * @param {number} maxLength - максимальная длина
 * @returns {string} обрезанный текст
 */
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Генерирует случайный ID
 * @param {number} length - длина ID
 * @returns {string} случайный ID
 */
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Проверяет является ли значение числом
 * @param {any} value - значение для проверки
 * @returns {boolean} true если значение число
 */
function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Форматирует число с разделителями тысяч
 * @param {number} number - число для форматирования
 * @returns {string} отформатированное число
 */
function formatNumber(number) {
  return new Intl.NumberFormat('ru-RU').format(number);
}

module.exports = {
  formatTemperature,
  capitalizeFirst,
  formatWeatherDescription,
  createProgressBar,
  formatDate,
  formatTime,
  escapeMarkdown,
  delay,
  isValidEmail,
  truncateText,
  generateId,
  isNumeric,
  formatNumber
};