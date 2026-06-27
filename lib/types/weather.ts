export type WeatherLocation = {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
  timezone?: string
}

export type DailyWeather = {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_probability_max: number[]
  relative_humidity_2m_mean: number[]
  wind_speed_10m_max: number[]
}

export type WeatherForecast = {
  latitude: number
  longitude: number
  timezone: string
  daily_units: {
    temperature_2m_max: string
    temperature_2m_min: string
    wind_speed_10m_max: string
    precipitation_probability_max: string
  }
  daily: DailyWeather
}
