// WeatherAPI.com Configuration
const API_KEY = 'e33f3d5a928543e6b5a183956252707'; // Replace with your actual key
const BASE_URL = 'https://api.weatherapi.com/v1';


// DOM Elements
const elements = {
    cityName: document.querySelector('.city-name'),
    currentTime: document.getElementById('current-time'),
    currentDate: document.getElementById('current-date'),
    currentTemp: document.querySelector('.current-temp'),
    feelsLike: document.querySelector('.feels-like'),
    weatherIcon: document.querySelector('.weather-icon'),
    weatherCondition: document.querySelector('.weather-condition'),
    humidity: document.querySelector('.detail-item:nth-child(1) .detail-value'),
    wind: document.querySelector('.detail-item:nth-child(2) .detail-value'),
    pressure: document.querySelector('.detail-item:nth-child(3) .detail-value'),
    uv: document.querySelector('.detail-item:nth-child(4) .detail-value'),
    sunrise: document.querySelector('.sun-time:nth-child(1) span:last-child'),
    sunset: document.querySelector('.sun-time:nth-child(2) span:last-child'),
    searchInput: document.querySelector('.search-input'),
    currentLocationBtn: document.querySelector('.current-location'),
    forecastContainer: document.querySelector('.forecast-items'),
    hourlyContainer: document.querySelector('.hourly-forecast'),
    forecastLoading: document.querySelector('.forecast-loading'),
    hourlyLoading: document.querySelector('.hourly-loading')
};
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.querySelector('.toggle-switch');

    // Toggle class on body
    body.classList.toggle('light-mode');

    // Toggle switch appearance
    toggle.classList.toggle('active');

    // Save preference
    const isDark = !body.classList.contains('light-mode');
    localStorage.setItem('isDarkMode', isDark);
}

// On load, apply saved preference
window.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('isDarkMode') === 'true';
    const body = document.body;
    const toggle = document.querySelector('.toggle-switch');

    if (!isDark) {
        body.classList.add('light-mode');
        toggle.classList.remove('active');
    }
});

// Weather icon mapping
const weatherIcons = {
    '1000': '☀️', '1003': '⛅', '1006': '☁️', '1009': '☁️',
    '1030': '🌫️', '1063': '🌦️', '1066': '❄️', '1069': '🌨️',
    '1072': '🌧️', '1087': '⛈️', '1114': '❄️', '1117': '❄️',
    '1135': '🌫️', '1147': '🌫️', '1150': '🌧️', '1153': '🌧️',
    '1168': '🌧️', '1171': '🌧️', '1180': '🌦️', '1183': '🌧️',
    '1186': '🌧️', '1189': '🌧️', '1192': '🌧️', '1195': '🌧️',
    '1198': '🌧️', '1201': '❄️', '1204': '🌨️', '1207': '🌨️',
    '1210': '❄️', '1213': '❄️', '1216': '❄️', '1219': '❄️',
    '1222': '❄️', '1225': '❄️', '1237': '❄️', '1240': '🌦️',
    '1243': '🌧️', '1246': '🌧️', '1249': '🌨️', '1252': '🌨️',
    '1255': '❄️', '1258': '❄️', '1261': '❄️', '1264': '❄️',
    '1273': '⛈️', '1276': '⛈️', '1279': '⛈️', '1282': '⛈️'
};

// Format time based on timezone
const formatTime = (timeString, timezone) => {
    return new Date(timeString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone
    });
};

// Format date based on timezone
const formatDate = (dateString, timezone) => {
    return new Date(dateString).toLocaleDateString([], {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        timeZone: timezone
    });
};

// Format hourly time without minutes
const formatHourlyTime = (timeString, timezone) => {
    return new Date(timeString).toLocaleTimeString([], {
        hour: '2-digit',
        timeZone: timezone
    }).replace(/\s/g, '');
};

// Fetch weather data with error handling
async function fetchWeatherData(endpoint, params) {
    const url = `${BASE_URL}${endpoint}?key=${API_KEY}&${new URLSearchParams(params)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        alert(`Weather data unavailable: ${error.message}`);
        return null;
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    if (!data || !data.current || !data.location) return;
    
    const { tz_id: timezone, localtime, name } = data.location;
    
    // Update basic info
    elements.cityName.textContent = name;
    elements.currentTemp.textContent = `${Math.round(data.current.temp_c)}°C`;
    elements.feelsLike.textContent = `Feels like: ${Math.round(data.current.feelslike_c)}°C`;
    
    // Update weather condition
    const weatherCode = data.current.condition.code.toString();
    elements.weatherIcon.textContent = weatherIcons[weatherCode] || '☀️';
    elements.weatherCondition.textContent = data.current.condition.text;
    
    // Update weather details
    elements.humidity.textContent = `${data.current.humidity}%`;
    elements.wind.textContent = `${Math.round(data.current.wind_kph)}km/h`;
    elements.pressure.textContent = `${data.current.pressure_mb}hPa`;
    elements.uv.textContent = data.current.uv;
    
    // Update current time and date
    updateLocalTime(timezone);
    
    // Get astronomy data
    fetchWeatherData('/astronomy.json', {
        q: name,
        dt: localtime.split(' ')[0]
    }).then(astroData => {
        if (astroData?.astronomy?.astro) {
            elements.sunrise.textContent = `Sunrise ${astroData.astronomy.astro.sunrise}`;
            elements.sunset.textContent = `Sunset ${astroData.astronomy.astro.sunset}`;
        }
    });
}

// Update local time display
function updateLocalTime(timezone) {
    const now = new Date();
    elements.currentTime.textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone
    });
    elements.currentDate.textContent = now.toLocaleDateString([], {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        timeZone: timezone
    });
}

// Update 5-day forecast
function updateForecast(forecastData) {
    if (!forecastData?.forecast?.forecastday) return;
    
    elements.forecastLoading.style.display = 'none';
    elements.forecastContainer.innerHTML = '';
    
    const timezone = forecastData.location.tz_id;
    
    forecastData.forecast.forecastday.slice(0, 5).forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString([], { 
            weekday: 'short',
            timeZone: timezone
        });
        
        const weatherCode = day.day.condition.code.toString();
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-day">
                <div class="forecast-icon">${weatherIcons[weatherCode] || '☀️'}</div>
                <div>
                    <div>${dayName}, ${date.getDate()} ${date.toLocaleString('default', { 
                        month: 'short',
                        timeZone: timezone
                    })}</div>
                </div>
            </div>
            <div class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</div>
        `;
        elements.forecastContainer.appendChild(forecastItem);
    });
}

// Update hourly forecast
function updateHourlyForecast(forecastData) {
    if (!forecastData?.forecast?.forecastday[0]?.hour || !elements.hourlyContainer) return;
    
    elements.hourlyLoading.style.display = 'none';
    elements.hourlyContainer.innerHTML = '';
    
    const timezone = forecastData.location.tz_id;
    
    forecastData.forecast.forecastday[0].hour
        .filter((_, index) => index % 3 === 0)
        .slice(0, 8)
        .forEach(hour => {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
                <div class="hourly-time">${formatHourlyTime(hour.time, timezone)}</div>
                <div class="hourly-icon">${weatherIcons[hour.condition.code.toString()] || '☀️'}</div>
                <div class="hourly-temp">${Math.round(hour.temp_c)}°C</div>
                <div class="wind-speed">
                    <span class="wind-arrow">${getWindDirection(hour.wind_degree)}</span>
                    <span>${Math.round(hour.wind_kph)}km/h</span>
                </div>
            `;
            elements.hourlyContainer.appendChild(hourlyItem);
        });
}

// Get wind direction arrow
function getWindDirection(degrees) {
    const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    return directions[Math.round((degrees % 360) / 45) % 8] || '→';
}

// Get weather by city name
async function getWeatherByCity(cityName) {
    if (!cityName?.trim()) return;
    
    const data = await fetchWeatherData('/forecast.json', {
        q: cityName,
        days: 5,
        aqi: 'no',
        alerts: 'no'
    });
    
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data);
        updateHourlyForecast(data);
        
        // Update time continuously
        const timezone = data.location.tz_id;
        setInterval(() => updateLocalTime(timezone), 1000);
    }
}

// Get weather by geolocation
async function getWeatherByLocation(lat, lon) {
    const data = await fetchWeatherData('/forecast.json', {
        q: `${lat},${lon}`,
        days: 5,
        aqi: 'no',
        alerts: 'no'
    });
    
    if (data) {
        updateCurrentWeather(data);
        updateForecast(data);
        updateHourlyForecast(data);
        
        // Update time continuously
        const timezone = data.location.tz_id;
        setInterval(() => updateLocalTime(timezone), 1000);
    }
}

// Handle geolocation
function getCurrentLocation() {
    elements.currentLocationBtn.textContent = '📍 Locating...';
    
    if (!navigator.geolocation) {
        alert('Geolocation not supported by your browser');
        elements.currentLocationBtn.textContent = '🎯 Current Location';
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        position => {
            getWeatherByLocation(position.coords.latitude, position.coords.longitude);
            elements.currentLocationBtn.textContent = '🎯 Current Location';
        },
        error => {
            console.error('Geolocation error:', error);
            alert('Location access denied. Please search manually.');
            elements.currentLocationBtn.textContent = '🎯 Current Location';
        }
    );
}

// Event listeners
elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherByCity(elements.searchInput.value.trim());
        elements.searchInput.value = '';
    }
});

elements.currentLocationBtn.addEventListener('click', getCurrentLocation);

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    getWeatherByCity('Athens');
});