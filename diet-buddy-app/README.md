# Diet Buddy - Local-First Diet Tracking App

A modern, minimalist web app for tracking diet and nutrition with a glassmorphism design and full dark mode support.

## 🎨 Features

- **Responsive Design**: Sidebar navigation on desktop, bottom tab bar on mobile
- **Glassmorphism Aesthetic**: Subtle blurs and borders for a modern look
- **Full Dark Mode**: Light/dark theme with system preference detection
- **Local-First Architecture**: Built with Next.js 15+ and SQLite via Prisma
- **TypeScript**: Fully typed for better developer experience
- **Tailwind CSS**: Utility-first styling framework

## 📋 Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Home page (redirects to dashboard)
│   ├── globals.css          # Global styles
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard page with stats
│   ├── logging/
│   │   └── page.tsx         # Food logging page
│   └── trends/
│       └── page.tsx         # Trends and analytics page
├── components/
│   ├── ClientThemeProvider.tsx
│   ├── Navigation.tsx
│   ├── ThemeToggle.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── features/
│   ├── dashboard/components/
│   ├── logging/components/
│   └── trends/components/
└── lib/

prisma/
└── schema.prisma            # Database schema with User, Entry, Goal models

Configuration files:
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── .env.local
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev --name init
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages

### Dashboard (`/dashboard`)
Summary view with daily nutrition statistics and recent entries

### Food Log (`/logging`)
List-based view for adding and managing food entries with detailed nutrition info

### Trends (`/trends`)
Analytics page with placeholder charts for visualizing nutrition progress

## 🎯 What's Included

✅ Complete responsive UI skeleton with glassmorphism design
✅ Hybrid navigation (sidebar + mobile tab bar)
✅ Light/dark theme with next-themes
✅ Feature-based folder structure
✅ Atomic UI components (Button, Card)
✅ Prisma database schema (User, Entry, Goal models)
✅ SQLite database with local-first architecture
✅ TypeScript throughout
✅ Tailwind CSS styling

## ⚠️ What's NOT Included

- Diet tracking functionality
- State management (Redux, Zustand, etc.)
- API routes for data fetching
- Authentication
- Actual database operations
- Form handlers
- Data visualization libraries

## 🔧 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Theme**: next-themes
- **Package Manager**: npm

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🎨 Customization

- **Colors**: Edit `tailwind.config.ts`
- **Fonts**: Modify in `globals.css`
- **Navigation**: Update items in `src/components/Navigation.tsx`
- **Database**: Extend `prisma/schema.prisma` and run migrations

## 📝 License

MIT
