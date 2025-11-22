# TinyLink - URL Shortener

A modern, responsive URL shortener built with Next.js 15 and Neon PostgreSQL. Features a clean interface, real-time click tracking, and comprehensive analytics.

## ✨ Features

### Core Functionality
- **URL Shortening**: Convert long URLs into compact, shareable links
- **Custom Codes**: Optional custom short codes (6-12 alphanumeric characters)
- **Click Tracking**: Real-time click counting with timestamps
- **Link Management**: Full CRUD operations for your links
- **Search & Filter**: Find links by code or URL

### User Interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Real-time Validation**: Inline form validation with helpful error messages
- **Loading States**: Visual feedback during operations
- **Success/Error States**: Clear confirmation and error messages
- **Sortable Tables**: Click column headers to sort data
- **Mobile-First**: Card layout for small screens, table for desktop

### Analytics & Monitoring
- **Detailed Statistics**: Individual link performance metrics
- **System Health**: Comprehensive health monitoring dashboard
- **Database Metrics**: Connection status and response times
- **Uptime Tracking**: System uptime and performance data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Neon PostgreSQL database account

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd tiny-link
   npm install
   ```

2. **Set up Neon Database:**
   - Create a free account at [neon.tech](https://neon.tech)
   - Create a new database project
   - Copy the connection string from your dashboard

3. **Configure environment:**
   - Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   - Update `.env.local` with your actual database URL:
   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The database tables will be created automatically on first use

## 📱 Pages & Routes

| Purpose | Path | Description |
|---------|------|-------------|
| **Dashboard** | `/` | Main interface - list, add, delete links with search/filter |
| **Stats** | `/code/:code` | Detailed statistics for individual links |
| **Redirect** | `/:code` | Redirects to original URL (increments click count) |
| **Health Check** | `/healthz` | System status, uptime, and database metrics |

## 🎯 User Workflow

1. **Create Links**: Use the dashboard to shorten URLs with optional custom codes
2. **View Stats**: Click any short code to see detailed analytics
3. **Share Links**: From the stats page, click the short code to visit (and count clicks)
4. **Manage**: Search, sort, and delete links from the main dashboard

## 🛠 API Endpoints

### Links Management
- `POST /api/links` - Create a new short link
  ```json
  {
    "url": "https://example.com",
    "customCode": "optional123"
  }
  ```
- `GET /api/links` - Retrieve all links with statistics
- `DELETE /api/links/[code]` - Delete a specific link

### System
- `GET /api/health` - Health check with database migration
- `GET /[code]` - Redirect to original URL (increments clicks)

## 🗄 Database Schema

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_clicked TIMESTAMP
);
```

**Key Features:**
- Automatic table creation and migration
- IST timezone support for timestamps
- Unique constraint on short codes
- Optimized for performance with proper indexing

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variable: `DATABASE_URL`
4. Deploy automatically

### Other Platforms
Compatible with any Node.js hosting platform that supports:
- Next.js 15
- PostgreSQL connections
- Environment variables

## 🎨 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Neon PostgreSQL (serverless)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready
- **Language**: JavaScript/JSX

## 🔧 Configuration

### Environment Variables
```env
# Required
DATABASE_URL=your_neon_connection_string

# Optional (for production)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Customization
- **Short Code Length**: Modify validation in `/app/api/links/route.js`
- **Styling**: Update Tailwind classes throughout components
- **Database**: Schema modifications in `/lib/db.js`

## 📊 Features in Detail

### Dashboard (`/`)
- **Responsive Table**: Desktop table view, mobile card layout
- **Add Links**: Modal form with real-time validation
- **Search**: Filter by short code or URL
- **Sort**: Click headers to sort by any column
- **Actions**: Delete links with confirmation

### Stats Page (`/code/:code`)
- **Link Details**: Complete information about the link
- **Click Metrics**: Total clicks and last accessed time
- **Direct Access**: Clickable short code to visit original URL
- **Navigation**: Easy return to dashboard

### Health Monitor (`/healthz`)
- **System Status**: Overall health indicator
- **Uptime**: Server uptime tracking
- **Database**: Connection status and response times
- **Performance**: Memory usage and system information

## 🤝 Acknowledgments

This project was developed with assistance from **Amazon Q Developer** (not ChatGPT), an AI coding assistant integrated into the IDE that helped with:
- Architecture design and best practices
- UI/UX improvements and responsive design
- Database optimization and error handling
- Code review and performance enhancements
- Real-time debugging and problem-solving

**Note**: This project was built using Amazon Q Developer within the IDE environment, which provides contextual assistance and code generation. No external ChatGPT conversation was used.

Special thanks to Amazon Q Developer for guidance on modern web development patterns and user experience design.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Issues & Contributing

Found a bug or want to contribute? Please open an issue or submit a pull request.

---

**Built with ❤️ using Next.js and Neon PostgreSQL**