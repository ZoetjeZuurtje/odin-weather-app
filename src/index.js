import './index.css'
import * as api_keys from './api_keys.json'

const openWeatherAPI = api_keys.openWeather

function getLocation () {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser')
    return
  }
  navigator.geolocation.getCurrentPosition(getWeatherData)
}

function getWeatherData (position) {
  const lat = position.coords.latitude
  const lon = position.coords.longitude
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPI}`

  fetch(url)
    .then(response => {
      return response.json()
    })
    .then(weatherData => {
      // Todo
    })
}