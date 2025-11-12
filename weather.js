const weatherDiv = document.getElementById('current-weather');

const daysMap = {
    mo: 0,
    tu: 1,
    we: 2,
    th: 3,
    fr: 4,
    sa: 5,
    su: 6
};

async function fetchWeather() {
    const url =
        'https://api.open-meteo.com/v1/forecast?latitude=40.64&longitude=22.94&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto';

    try {
        const resp = await fetch(url);
        const data = await resp.json();

       
        const todayIndex = new Date().getDay();
        const dayIds = Object.keys(daysMap);
        const todayId = dayIds.find(id => daysMap[id] === (todayIndex === 0 ? 6 : todayIndex - 1));
        renderDay(todayId, data);

       
        Object.keys(daysMap).forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                renderDay(id, data);
            });
        });

    } catch (err) {
        weatherDiv.innerHTML = `<p>Failed to load weather data.</p>`;
        console.error(err);
    }
}

function getWeatherInfo(code) {
    const map = {
        0: { text: "Clear sky", icon: "☀️" },
        1: { text: "Mainly clear", icon: "🌤️" },
        2: { text: "Partly cloudy", icon: "⛅" },
        3: { text: "Overcast", icon: "☁️" },
        45: { text: "Fog", icon: "🌫️" },
        48: { text: "Depositing rime fog", icon: "🌫️" },
        51: { text: "Drizzle: Light", icon: "🌦️" },
        53: { text: "Drizzle: Moderate", icon: "🌦️" },
        55: { text: "Drizzle: Dense", icon: "🌧️" },
        56: { text: "Freezing Drizzle: Light", icon: "🌧️❄️" },
        57: { text: "Freezing Drizzle: Dense", icon: "🌧️❄️" },
        61: { text: "Rain: Light", icon: "🌧️" },
        63: { text: "Rain: Moderate", icon: "🌧️" },
        65: { text: "Rain: Heavy", icon: "🌧️🌧️" },
        66: { text: "Freezing Rain: Light", icon: "🌧️❄️" },
        67: { text: "Freezing Rain: Heavy", icon: "🌧️❄️" },
        71: { text: "Snow fall: Light", icon: "🌨️" },
        73: { text: "Snow fall: Moderate", icon: "🌨️" },
        75: { text: "Snow fall: Heavy", icon: "❄️🌨️" },
        77: { text: "Snow grains", icon: "❄️" },
        80: { text: "Rain showers: Light", icon: "🌦️" },
        81: { text: "Rain showers: Moderate", icon: "🌦️" },
        82: { text: "Rain showers: Violent", icon: "🌧️🌧️" },
        85: { text: "Snow showers: Light", icon: "🌨️" },
        86: { text: "Snow showers: Heavy", icon: "❄️🌨️" },
        95: { text: "Thunderstorm: Moderate", icon: "⛈️" },
        96: { text: "Thunderstorm with hail: Light", icon: "⛈️❄️" },
        99: { text: "Thunderstorm with hail: Heavy", icon: "⛈️❄️" }
    };
    return map[code] || { text: "Unknown weather", icon: "❓" };
}

function renderDay(dayId, data) {
    const index = daysMap[dayId];

    const date = data.daily.time[index];
    const max = data.daily.temperature_2m_max[index];
    const min = data.daily.temperature_2m_min[index];
    const code = data.daily.weathercode[index];

    const info = getWeatherInfo(code);

    Object.keys(daysMap).forEach(id => document.getElementById(id).classList.remove('active'));
    document.getElementById(dayId).classList.add('active');

    weatherDiv.innerHTML = `
        <h2>Thessaloniki</h2>
        <p>${date}</p>
        <p style="font-size:40px">${info.icon}</p>
        <p>${info.text}</p>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
    `;
}

document.addEventListener('DOMContentLoaded', fetchWeather);
