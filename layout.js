import './globals.css'

export const metadata = {
  title: 'TinyLink - URL Shortener',
  description: 'Shorten URLs and track clicks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">TinyLink</h1>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}