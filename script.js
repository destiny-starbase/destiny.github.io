class WeatherApp {
    constructor() {
        this.BASE_URL = 'https://api.open-meteo.com/v1';
        // Default coordinates for Hong Kong
        this.defaultLat = 22.3193;
        this.defaultLong = 114.1694;
    }

    async getCurrentWeather() {
        try {
            const response = await fetch(
                `${this.BASE_URL}/forecast?latitude=${this.defaultLat}&longitude=${this.defaultLong}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw error;
        }
    }

    async getForecast() {
        try {
            const response = await fetch(
                `${this.BASE_URL}/forecast?latitude=${this.defaultLat}&longitude=${this.defaultLong}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max&timezone=auto`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }

    getWeatherDescription(code) {
        const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm'
        };
        return weatherCodes[code] || 'Unknown';
    }

    displayCurrentWeather(data) {
        const weatherCard = document.querySelector('.weather-card');
        const loading = document.getElementById('loading');
        const current = data.current;

        loading.style.display = 'none';
        weatherCard.innerHTML = `
            <h3>Hong Kong</h3>
            <div class="weather-info">
                <p class="temperature">${Math.round(current.temperature_2m)}°C</p>
                <p class="condition">${this.getWeatherDescription(current.weather_code)}</p>
                <p class="humidity">Humidity: ${current.relative_humidity_2m}%</p>
                <p class="wind">Wind: ${current.wind_speed_10m} km/h</p>
            </div>
        `;
    }

    displayForecast(data) {
        const forecastContainer = document.querySelector('.forecast-container');
        const daily = data.daily;
        
        const forecastHTML = daily.time.map((time, index) => `
            <div class="forecast-card">
                <h4>${new Date(time).toLocaleDateString()}</h4>
                <p class="temp-range">${Math.round(daily.temperature_2m_min[index])}°C - ${Math.round(daily.temperature_2m_max[index])}°C</p>
                <p class="condition">${this.getWeatherDescription(daily.weather_code[index])}</p>
                <p class="humidity">Humidity: ${daily.relative_humidity_2m_max[index]}%</p>
            </div>
        `).join('');

        forecastContainer.innerHTML = forecastHTML;
    }

    async init() {
        try {
            const currentWeather = await this.getCurrentWeather();
            this.displayCurrentWeather(currentWeather);

            const forecast = await this.getForecast();
            this.displayForecast(forecast);
        } catch (error) {
            const loading = document.getElementById('loading');
            loading.textContent = 'Error loading weather data. Please try again later.';
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const weatherApp = new WeatherApp();
    weatherApp.init();
}); 