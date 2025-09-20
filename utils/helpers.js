function formatTemperature(temp) {
  return `${temp > 0 ? '+' : ''}${Math.round(temp)}°C`;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  formatTemperature,
  capitalizeFirst
};