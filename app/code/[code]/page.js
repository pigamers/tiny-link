'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function StatsPage() {
  const params = useParams()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links`)
      const links = await res.json()
      const foundLink = links.find(l => l.short_code === params.code)
      setLink(foundLink)
    } catch (error) {
      console.error('Error fetching link:', error)
    }
    setLoading(false)
  }
  
  useEffect(() => {
    fetchLink()
    
    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      fetchLink()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [params.code])
  
  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }
  
  if (!link) {
    return <div className="text-center py-12">Link not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Link Statistics</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Short Code</label>
            <div className="mt-1">
              <a 
                href={`/${link.short_code}`}
                target="_blank"
                className="font-mono text-lg text-blue-600 hover:text-blue-800 hover:underline"
                title="Click to visit original URL"
              >
                {link.short_code}
              </a>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Target URL</label>
            <div className="mt-1 break-all text-gray-900">{link.original_url}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Total Clicks</label>
            <div className="mt-1 text-2xl font-bold text-gray-900">{link.clicks}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Created</label>
            <div className="mt-1 text-gray-900">{new Date(link.created_at).toLocaleString()}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Last Clicked</label>
            <div className="mt-1 text-gray-900">
              {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <a href="/" className="text-blue-600 hover:text-blue-700">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  )
}