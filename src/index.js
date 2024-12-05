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

async function getWeatherData () {
  if (config.coords.latitude === null) {
    getLocation(getWeatherData)
    return
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${config.coords.latitude}&lon=${config.coords.longitude}&appid=${config.key}&units=${units}`
  const response = await fetch(url)
  const data = await response.json()

  const weatherData = processWeatherData(data)
  console.log(weatherData)
}

function processWeatherData (data) {
  const weatherData = {
    temperature: {
      min: data.main.temp_min,
      max: data.main.temp_max,
      real: data.main.temp,
      feels_like: data.main.feels_like
    },
    weather: {
      clouds: data.clouds.all,
      rain: data.rain['1h'],
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg
    }
  }
  return weatherData
}
