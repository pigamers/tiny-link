'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      
      const data = await res.json()
      if (res.ok) {
        setShortUrl(`${window.location.origin}/${data.shortCode}`)
        setUrl('')
      }
    } catch (error) {
      console.error('Error:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shorten Your URLs</h1>
        <p className="text-gray-600">Create short links and track their performance</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>

      {shortUrl && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 mb-2">Your shortened URL:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-green-300 rounded"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shortUrl)
                alert('Copied to clipboard!')
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}