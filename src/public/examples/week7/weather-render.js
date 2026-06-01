// render.js

export function renderWeatherCard(data) {
  const weatherObj = document.getElementById("weather");
  weatherObj.innerHTML = `
        <h2>${data.location} ${data.icon}</h2>
        <h3>${data.conditions}</h3>
        <h3>Temperature: ${data.temp}</h3>
        <h3>Windspeed: ${data.windspeed}</h3>
    `;
}
