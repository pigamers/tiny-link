import './globals.css'

export const metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'Shorten URLs and track clicks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  TinyLink
                </a>
              </div>
              <div className="flex items-center gap-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Dashboard
                </a>
                <a href="/healthz" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Status
                </a>
              </div>
            </div>
          </nav>
        </header>
        
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>© 2025 TinyLink. Simple URL shortening.</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a href="/healthz" className="text-gray-600 hover:text-blue-600 transition-colors">
                  System Health
                </a>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Built with Next.js & Neon</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
