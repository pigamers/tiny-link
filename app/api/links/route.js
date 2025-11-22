import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createLinksTable, createLink, getAllLinks } from '../../../lib/db'

export async function POST(request) {
  try {
    await createLinksTable()
    
    const { url, customCode } = await request.json()
    
    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Valid URL required' }, { status: 400 })
    }

    // Generate or validate short code
    let shortCode
    if (customCode) {
      // Validate custom code: only letters and numbers, 6-8 characters
      if (!/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
        return NextResponse.json({ error: 'Code must be 6-8 alphanumeric characters' }, { status: 400 })
      }
      shortCode = customCode
    } else {
      // Generate random 6-character code
      shortCode = nanoid(6).replace(/[^A-Za-z0-9]/g, '').substring(0, 6)
      // Ensure it's exactly 6 characters
      while (shortCode.length < 6) {
        shortCode += nanoid(1).replace(/[^A-Za-z0-9]/g, '')
      }
    }

    const link = await createLink(url, shortCode)
    
    return NextResponse.json({ shortCode: link.short_code })
  } catch (error) {
    if (error.message === 'Short code already exists') {
      return NextResponse.json({ error: 'Short code already exists. Please choose a different one.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const links = await getAllLinks()
    return NextResponse.json(links)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}