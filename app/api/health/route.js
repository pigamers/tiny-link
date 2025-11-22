import { NextResponse } from 'next/server'
import { createLinksTable } from '../../../lib/db'

export async function GET() {
  try {
    await createLinksTable()
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 })
  }
}