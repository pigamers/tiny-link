import { NextResponse } from 'next/server'
import { deleteLink, getLink } from '../../../../lib/db'

export async function GET(request, { params }) {
  try {
    const { code } = await params
    const link = await getLink(code)
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }
    return NextResponse.json(link)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { code } = await params
    await deleteLink(code)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}