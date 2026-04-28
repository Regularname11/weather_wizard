import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SearchParamsSchema = z.object({
  query: z.string().min(2),
  count: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries())
  const parsed = SearchParamsSchema.safeParse(params)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid search parameters' }, { status: 400 })
  }

  const upstreamParams = new URLSearchParams({
    name: parsed.data.query,
    count: parsed.data.count ?? '10',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${upstreamParams.toString()}`,
    { cache: 'no-store' },
  )

  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to search locations' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
