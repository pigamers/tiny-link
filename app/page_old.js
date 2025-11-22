'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [linksLoading, setLinksLoading] = useState(true)
  const [error, setError] = useState('')
  const [urlError, setUrlError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [success, setSuccess] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [links, setLinks] = useState([])
  const [filteredLinks, setFilteredLinks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchLinks()
  }, [])

  useEffect(() => {
    let filtered = links.filter(link => 
      link.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.original_url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })
    
    setFilteredLinks(filtered)
  }, [links, searchTerm, sortField, sortOrder])

  const validateUrl = (value) => {
    if (!value) {
      setUrlError('URL is required')
      return false
    }
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      setUrlError('URL must start with http:// or https://')
      return false
    }
    setUrlError('')
    return true
  }

  const validateCode = (value) => {
    if (value && !/^[A-Za-z0-9]{6,12}$/.test(value)) {
      setCodeError('Code must be 6-12 alphanumeric characters')
      return false
    }
    setCodeError('')
    return true
  }

  const fetchLinks = async () => {
    setLinksLoading(true)
    try {
      const res = await fetch('/api/links')
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    }
    setLinksLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const isUrlValid = validateUrl(url)
    const isCodeValid = validateCode(customCode)
    
    if (!isUrlValid || !isCodeValid) return
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customCode })
      })
      
      const data = await res.json()
      if (res.ok) {
        const newShortUrl = `${window.location.origin}/${data.shortCode}`
        setShortUrl(newShortUrl)
        setSuccess('Link created successfully!')
        setUrl('')
        setCustomCode('')
        fetchLinks()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to create link. Please try again.')
    }
    
    setLoading(false)
  }

  const deleteLink = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) return
    
    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' })
      
      if (res.ok) {
        setLinks(prev => prev.filter(link => link.short_code !== code))
      } else {
        const data = await res.json()
        setError(`Failed to delete: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      setError('Error deleting link')
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      setError('Failed to copy to clipboard')
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shorten Your URLs</h1>
        <p className="text-gray-600">Create short links and track their performance</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Custom short code (optional)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

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

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Links</h2>
        
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code or URL..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {filteredLinks.length === 0 ? (
          <p className="text-gray-600">{searchTerm ? 'No links match your search.' : 'No links created yet.'}</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('short_code')}>
                      <div className="flex items-center gap-1">
                        Short Code
                        {sortField === 'short_code' && (
                          <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('clicks')}>
                      <div className="flex items-center gap-1">
                        Clicks
                        {sortField === 'clicks' && (
                          <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('last_clicked')}>
                      <div className="flex items-center gap-1">
                        Last Clicked
                        {sortField === 'last_clicked' && (
                          <svg className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a href={`/${link.short_code}`} target="_blank" className="text-blue-600 font-mono text-sm bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                            {link.short_code}
                          </a>
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}/${link.short_code}`)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy link"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                          <div className="truncate text-sm text-gray-900" title={link.original_url}>
                            {link.original_url}
                          </div>
                          <a 
                            href={link.original_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Visit →
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900">{link.clicks}</span>
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.last_clicked ? (
                          <div>
                            <div>{new Date(link.last_clicked).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">{new Date(link.last_clicked).toLocaleTimeString()}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteLink(link.short_code)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          title="Delete link"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {filteredLinks.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredLinks.length} of {links.length} links
          </div>
        )}
      </div>
    </div>
  )
}
