'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [links, setLinks] = useState([])
  const [filteredLinks, setFilteredLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCustomCode, setNewCustomCode] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [urlError, setUrlError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [copySuccess, setCopySuccess] = useState(false)

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

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links')
      const data = await res.json()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching links:', error)
    }
    setLoading(false)
  }

  const deleteLink = async (code) => {
    if (!confirm('Are you sure you want to delete this link?')) return
    
    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (res.ok) {
        // Remove from local state immediately
        setLinks(prev => prev.filter(link => link.short_code !== code))
        alert('Link deleted successfully')
      } else {
        console.error('Delete failed:', data)
        alert(`Failed to delete link: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting link:', error)
      alert('Error deleting link')
    }
  }

  const addLink = async (e) => {
    e.preventDefault()
    
    const isUrlValid = validateUrl(newUrl)
    const isCodeValid = validateCode(newCustomCode)
    
    if (!isUrlValid || !isCodeValid) return
    
    setAddLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, customCode: newCustomCode })
      })
      
      const data = await res.json()
      if (res.ok) {
        setSuccess('Link created successfully!')
        setNewUrl('')
        setNewCustomCode('')
        setShowAddForm(false)
        fetchLinks()
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to create link. Please try again.')
    }
    
    setAddLoading(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Link
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Link</h2>
          <form onSubmit={addLink} className="space-y-4">
            <div>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value)
                  if (e.target.value) validateUrl(e.target.value)
                }}
                onBlur={() => validateUrl(newUrl)}
                placeholder="Enter URL (https://example.com)"
                className={`w-full px-4 py-2 border rounded-lg ${urlError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                required
              />
              {urlError && <p className="mt-1 text-sm text-red-600">{urlError}</p>}
            </div>
            <div>
              <input
                type="text"
                value={newCustomCode}
                onChange={(e) => {
                  setNewCustomCode(e.target.value)
                  if (e.target.value) validateCode(e.target.value)
                }}
                onBlur={() => validateCode(newCustomCode)}
                placeholder="Custom code (optional, 6-12 characters)"
                className={`w-full px-4 py-2 border rounded-lg ${codeError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              {codeError && <p className="mt-1 text-sm text-red-600">{codeError}</p>}
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{success}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addLoading || urlError || codeError}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addLoading ? 'Adding...' : 'Add Link'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by code or URL..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      
      {copySuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-600">Link copied to clipboard!</span>
        </div>
      )}
      
      {filteredLinks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">{searchTerm ? 'No links match your search.' : 'No links created yet.'}</p>
          {!searchTerm && <a href="/" className="text-blue-600 hover:underline">Create your first link</a>}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Short Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Clicked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`/code/${link.short_code}`}
                        className="text-blue-600 hover:underline font-mono"
                      >
                        {link.short_code}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate" title={link.original_url}>
                        {link.original_url}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {link.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteLink(link.short_code)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredLinks.map((link) => (
              <div key={link.id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <a 
                    href={`/code/${link.short_code}`}
                    className="text-blue-600 hover:underline font-mono text-lg font-semibold"
                  >
                    {link.short_code}
                  </a>
                  <button
                    onClick={() => deleteLink(link.short_code)}
                    className="text-red-600 hover:text-red-900 text-sm ml-2"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2 break-all">
                  {link.original_url}
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{link.clicks} clicks</span>
                  <span>{link.last_clicked ? new Date(link.last_clicked).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}