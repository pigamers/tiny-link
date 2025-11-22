import { redirect, notFound } from 'next/navigation'
import { getLink, incrementClicks } from '../../lib/db'

export default async function RedirectPage({ params }) {
  const { code } = await params
  const link = await getLink(code)
  
  if (!link) {
    notFound()
  }

  await incrementClicks(code)
  redirect(link.original_url)
}