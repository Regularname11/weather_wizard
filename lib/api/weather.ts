import { WeatherForecast, WeatherLocation } from '@/lib/types/weather'

type SearchResponse = {
  results?: WeatherLocation[]
}

export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  const params = new URLSearchParams({
    query,
    count: '10',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`/api/weather/search?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to search locations')
  }

  const data = (await response.json()) as SearchResponse
  return data.results ?? []
}

export async function getForecast(
  latitude: number,
  longitude: number,
  temperatureUnit: 'celsius' | 'fahrenheit',
  days: number,
): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    temperatureUnit,
    days: days.toString(),
  })

  const response = await fetch(`/api/weather/forecast?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to fetch forecast')
  }

  return (await response.json()) as WeatherForecast
}
