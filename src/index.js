import './index.css'
import './api_keys.json'

const config = {
  'key': openWeather,
  'coords': {
    'latitude': null,
    'longitude': null
  },
}

function setLocation (pos) {
  config.coords.latitude = pos.coords.latitude
  config.coords.longitude = pos.coords.longitude
}

function getLocation () {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser')
    return
  }
  navigator.geolocation.getCurrentPosition(setLocation)
}

async function getWeatherData () {
  if (config.coords.latitude !== null) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${config.coords.latitude}&lon=${config.coords.longitude}&appid=${config.key}`
    const response = await fetch(url)
    const weatherData = await response.json()
  } else {
    getLocation()
  }

}