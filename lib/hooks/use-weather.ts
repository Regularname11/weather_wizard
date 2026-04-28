'use client'

import { useQuery } from '@tanstack/react-query'
import { getForecast, searchLocations } from '@/lib/api/weather'

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: ['location-search', query],
    queryFn: () => searchLocations(query),
    enabled: query.trim().length >= 2,
  })
}

export function useForecast(
  latitude: number | undefined,
  longitude: number | undefined,
  temperatureUnit: 'celsius' | 'fahrenheit',
  days: number,
) {
  return useQuery({
    queryKey: ['forecast', latitude, longitude, temperatureUnit, days],
    queryFn: () => getForecast(latitude!, longitude!, temperatureUnit, days),
    enabled: latitude !== undefined && longitude !== undefined,
  })
}
