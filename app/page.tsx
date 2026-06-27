'use client'

import { useMemo, useState } from 'react'
import styles from './page.module.scss'
import { useForecast, useLocationSearch } from '@/lib/hooks/use-weather'
import { WeatherLocation } from '@/lib/types/weather'
import { useTheme } from '@/lib/theme-provider'
import { WEATHER_CODES } from '@/lib/consts'

function weatherCodeToLabel(code: number) {
  return WEATHER_CODES[code] ?? { description: 'Unknown', emoji: '🌡️' }
}

export default function Home() {
  const [query, setQuery] = useState('Helsinki')
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null)
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius')
  const [days, setDays] = useState(5)

  const { theme, toggleTheme } = useTheme()

  const locationSearch = useLocationSearch(query)
  const locations = locationSearch.data ?? []

  const activeLocation = selectedLocation ?? locations[0]
  const forecast = useForecast(activeLocation?.latitude, activeLocation?.longitude, unit, days)

  const dailyCards = useMemo(() => {
    if (!forecast.data) return []
    const { daily } = forecast.data
    return daily.time.map((date, idx) => ({
      date,
      code: daily.weather_code[idx],
      max: daily.temperature_2m_max[idx],
      min: daily.temperature_2m_min[idx],
      rainProbability: daily.precipitation_probability_max[idx],
      humidity: Math.round(daily.relative_humidity_2m_mean[idx]),
      wind: daily.wind_speed_10m_max[idx],
    }))
  }, [forecast.data])

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>
          Weather Wizard <span className={styles.emojiTitle}>🧙🏽‍♂️</span>
        </h1>
        <p>Search locations, switch units, and review up to 10 days of forecast.</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.controls}>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedLocation(null)
            }}
            placeholder="Search city (e.g., London, Tokyo, Marrakesh)"
          />

          <select
            className={styles.select}
            value={activeLocation?.id ?? ''}
            onChange={(event) => {
              const next = locations.find(
                (location) => location.id.toString() === event.target.value,
              )
              setSelectedLocation(next ?? null)
            }}
          >
            {locations.length === 0 ? (
              <option value="">No matching locations</option>
            ) : (
              locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}, {location.admin1 ? `${location.admin1}, ` : ''}
                  {location.country}
                </option>
              ))
            )}
          </select>

          <div className={styles.toggles}>
            <button className={styles.toggleButton} onClick={toggleTheme} type="button">
              {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            </button>
            <button
              className={`${styles.toggleButton} ${unit === 'celsius' ? styles.activeToggle : ''}`}
              onClick={() => setUnit('celsius')}
              type="button"
            >
              Celsius
            </button>
            <button
              className={`${styles.toggleButton} ${unit === 'fahrenheit' ? styles.activeToggle : ''}`}
              onClick={() => setUnit('fahrenheit')}
              type="button"
            >
              Fahrenheit
            </button>

            <button
              className={`${styles.toggleButton} ${days === 5 ? styles.activeToggle : ''}`}
              onClick={() => setDays(5)}
              type="button"
            >
              5 days
            </button>
            <button
              className={`${styles.toggleButton} ${days === 10 ? styles.activeToggle : ''}`}
              onClick={() => setDays(10)}
              type="button"
            >
              10 days
            </button>
          </div>
        </div>

        {locationSearch.isError && <p className={styles.error}>Location search failed.</p>}
        {forecast.isError && <p className={styles.error}>Forecast request failed.</p>}
      </section>

      <section className={styles.cards}>
        {forecast.isLoading &&
          Array.from({ length: days }).map((_, idx) => (
            <article key={idx} className={styles.card}>
              <h3>Loading...</h3>
              <p>Preparing forecast card</p>
            </article>
          ))}

        {!forecast.isLoading &&
          dailyCards.map((day) => (
            <article key={day.date} className={styles.card}>
              <h3>
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h3>
              <p>
                {weatherCodeToLabel(day.code).description}{' '}
                <span aria-hidden="true" className={styles.emoji}>
                  {weatherCodeToLabel(day.code).emoji}
                </span>
              </p>
              <p>
                High:{' '}
                <span className={styles.highTemp}>
                  {day.max}
                  {forecast.data?.daily_units.temperature_2m_max}
                </span>
              </p>
              <p>
                Low:{' '}
                <span className={styles.lowTemp}>
                  {day.min}
                  {forecast.data?.daily_units.temperature_2m_min}
                </span>
              </p>
              <p>Rain chance: {day.rainProbability}%</p>
              <p>Humidity: {day.humidity}%</p>
              <p>
                Wind: {day.wind} {unit === 'fahrenheit' ? 'mph' : 'km/h'}
              </p>
            </article>
          ))}
      </section>
    </main>
  )
}
