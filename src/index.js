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
