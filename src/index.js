import 'normalize.css'
import './index.css'
import keys from './api_keys.json'

const config = {
  key: keys.openWeather,
  coords: {
    latitude: null,
    longitude: null
  },
  units: 'metric' // Valid values: 'standard', 'metric', 'imperial'
}

function setLocation (pos) {
  config.coords.latitude = pos.coords.latitude
  config.coords.longitude = pos.coords.longitude
}

function getLocation (after = () => {}) {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser')
    return
  }
  navigator.geolocation.getCurrentPosition((position) => {
    setLocation(position)
    after()
  })
}

function processWeatherData (data) {
  const weatherData = {
    temperature: { // Kelvin by default. Celsius with standard units, and Fahrenheit with imperial units.
      // min: data.main.temp_min,
      // max: data.main.temp_max,
      real: data.main.temp,
      feels_like: data.main.feels_like
    },
    weather: {
      clouds: data.clouds.all, // Percentage. 0.2 means 20%
      rain: data?.rain['1h'] ?? 0, // mm/hour
      snow: data?.snow['1h'] ?? 0, // mm/hour
      windSpeed: data.wind.speed, // meter/sec by default. miles/hour with imperial units
      windDirection: data.wind.deg // meteorological (0° North wind, 90° East, etc)
      // visibility: data.visibility.value // Meters
    }
  }
  return weatherData
}

async function getWeatherData () {
  if (config.coords.latitude === null) {
    getLocation(getWeatherData)
    return
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${config.coords.latitude}&lon=${config.coords.longitude}&appid=${config.key}&units=${config.units}`
  const response = await fetch(url)
  const data = await response.json()

  return processWeatherData(data)
}

function setWind (speed, degrees) {
  document.querySelector('#wind-direction').style.setProperty('--direction', `${degrees - 45}deg`)

  document.querySelector('#wind-speed').textContent = `${speed}m/s`
}

function setPrecipitation (precipitationRate, precipitationType) {
  const iconElement = document.querySelector('#precipitation-type')
  const valueElement = document.querySelector('#precipitation-speed')

  const icon = precipitationType // TODO: add more precipitation types or icons.

  iconElement.textContent = icon
  valueElement.textContent = `${precipitationRate}mm/uur`
}
