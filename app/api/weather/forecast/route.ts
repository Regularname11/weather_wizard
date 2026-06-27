import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ForecastParamsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  temperatureUnit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
  days: z.coerce.number().min(1).max(10).default(7),
})

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = ForecastParamsSchema.safeParse(params)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid forecast parameters' }, { status: 400 })
  }

  const upstreamParams = new URLSearchParams({
    latitude: parsed.data.latitude.toString(),
    longitude: parsed.data.longitude.toString(),
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,relative_humidity_2m_mean,wind_speed_10m_max',
    temperature_unit: parsed.data.temperatureUnit,
    wind_speed_unit: parsed.data.temperatureUnit === 'fahrenheit' ? 'mph' : 'kmh',
    timezone: 'auto',
    forecast_days: parsed.data.days.toString(),
  })

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${upstreamParams.toString()}`,
    { cache: 'no-store' },
  )

  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to fetch forecast' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
