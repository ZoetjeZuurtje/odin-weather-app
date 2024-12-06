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
    return undefined
  }
  navigator.geolocation.getCurrentPosition(setLocation, () => {}, {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: Infinity
  })
}

function processWeatherData (data) {
  const currentTime = new Date()
  const isNight = data.sys.sundown < currentTime && currentTime < data.sys.sunrise
  let precipitationType = 'rainy'
  const rainRate = data?.rain?.['1h'] ?? 0
  const snowRate = data?.snow?.['1h'] ?? 0
  const precipitationRate = snowRate > rainRate ? snowRate : rainRate

  if (snowRate > rainRate) {
    precipitationType = 'weather_snowy'
  }

  const weatherData = {
    temperature: { // Kelvin by default. Celsius with standard units, and Fahrenheit with imperial units.
      // min: data.main.temp_min,
      // max: data.main.temp_max,
      real: data.main.temp,
      feels_like: data.main.feels_like
    },
    weather: {
      clouds: data.clouds.all, // Percentage. 0.2 means 20%
      precipitationRate, // mm/hour
      precipitationType, // mm/hour
      windSpeed: data.wind.speed, // meter/sec by default. miles/hour with imperial units
      windDirection: data.wind.deg // meteorological (0° North wind, 90° East, etc)
      // visibility: data.visibility.value // Meters
    },
    isNight
  }
  return weatherData
}

async function getWeatherData () {
  if (config.coords.latitude === null) {
    getLocation()
    return undefined
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${config.coords.latitude}&lon=${config.coords.longitude}&appid=${config.key}&units=${config.units}`
  const response = await fetch(url)
  const data = await response.json()

  return data
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

function setTemperature (temp, feelsLike) {
  document.querySelector('#real-temp').textContent = temp
  document.querySelector('#feels-like-temp').textContent = feelsLike
}

function setCloudiness (fraction, isNight) {
  const icons = {
    night: {
      cloudy: 'partly_cloudy_night',
      clear: 'bedtime'
    },
    day: {
      cloudy: 'partly_cloudy_day',
      clear: 'sunny'
    }
  }

  isNight = isNight ? 'night' : 'day'
  const isCloudy = fraction > 0.3 ? 'cloudy' : 'clear'

  document.querySelector('#cloud-symbol').textContent = icons[isNight][isCloudy]
}

function setWeatherData (processedWeatherData) {
  setWind(processedWeatherData.weather.windSpeed, processedWeatherData.weather.windDirection)
  setPrecipitation(processedWeatherData.weather.precipitationRate, processedWeatherData.weather.precipitationType)
  setCloudiness(processedWeatherData.weather.clouds, processedWeatherData.isNight)
  setTemperature(processedWeatherData.temperature.real, processedWeatherData.temperature.feels_like)
}

async function refreshData(counter = 1) {
  if (counter == 6) {
    console.error('could not fetch data!')
    return undefined;
  }
  counter++;
  try {
    const data = await getWeatherData() ?? new Error('Error fetching data. Retrying...')
    const processedData = processWeatherData(data);
    setWeatherData(processedData)
  } catch (error) {
    console.log(error)
    setTimeout(() => {
      refreshData(counter)
    }, 1e3 * counter);
    return undefined;
  }
  
}

refreshData()
