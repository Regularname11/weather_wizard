import { WEATHER_CODES } from './consts'

export function weatherCodeToLabel(code: number) {
  return WEATHER_CODES[code] ?? { description: 'Unknown', emoji: '🌡️' }
}
