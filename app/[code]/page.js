import { redirect, notFound } from 'next/navigation'
import { getLink, incrementClicks } from '../../lib/db'

export default async function RedirectPage({ params }) {
  const { code } = await params
  console.log('Redirect page - code:', code)
  
  const link = await getLink(code)
  console.log('Link found:', !!link)
  
  if (!link) {
    notFound()
  }

  console.log('About to increment clicks')
  const updatedLink = await incrementClicks(code)
  console.log('Updated link:', updatedLink)
  console.log('Clicks incremented, redirecting to:', link.original_url)
  
  redirect(link.original_url)
}