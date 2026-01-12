# 🚀 Quick Start Guide

## ⚡ Get Running in 30 Seconds

### 1. Start Development Server
```bash
cd "d:\Development\Diet Buddy"
npm run dev
```

### 2. Open Browser
Navigate to: **http://localhost:3000**

### 3. Explore
- **Dashboard** `/dashboard` - View daily nutrition stats
- **Log** `/logging` - Manage food entries
- **Trends** `/trends` - See analytics placeholders
- **Theme Toggle** - Click the theme button in sidebar/mobile nav

---

## 📱 Testing the UI

### Desktop (md+ breakpoints)
- Left sidebar with navigation (persistent)
- Main content area
- Theme toggle in sidebar footer

### Mobile (< md)
- Bottom tab navigation bar
- Full-width content
- Theme toggle in tab bar

### Dark Mode
- System preference auto-detection
- Manual toggle available
- Smooth theme transitions

---

## 🛠️ Development Workflow

### View Changes Live
The dev server supports hot reloading:
- Edit any `.tsx` file → auto-refresh
- Edit Tailwind classes → instant CSS update
- Edit `.css` files → instant update

### TypeScript Safety
All components are fully typed:
```tsx
// src/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}
```

### Component Pattern
```tsx
// Example: Creating a new component
"use client"; // If interactive

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function MyComponent() {
  return (
    <Card>
      <h2>Title</h2>
      <Button>Click Me</Button>
    </Card>
  );
}
```

---

## 📊 Database Setup (Optional)

If you want to activate Prisma:

```bash
# Initialize database
npx prisma migrate dev --name init

# Open Prisma Studio (visual DB explorer)
npx prisma studio

# Generate Prisma client
npx prisma generate
```

---

## 🎨 Styling Guide

### Using Tailwind Classes
```tsx
<div className="bg-white dark:bg-slate-950 p-4 rounded-lg">
  <p className="text-slate-900 dark:text-slate-50">Text</p>
</div>
```

### Using Glass Effect
```tsx
<div className="glass rounded-lg p-6">
  {/* Automatically gets blur + transparent bg + border */}
</div>
```

### Responsive Classes
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 📦 Project Structure Reminder

```
src/
├── app/                    # Pages & layouts
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home
│   ├── dashboard/page.tsx  # Dashboard
│   ├── logging/page.tsx    # Food log
│   └── trends/page.tsx     # Analytics
├── components/             # Reusable components
│   ├── Navigation.tsx      # Main navigation
│   ├── ThemeToggle.tsx     # Theme switcher
│   └── ui/                 # Atomic components
│       ├── Button.tsx
│       └── Card.tsx
└── features/               # Feature modules
    ├── dashboard/components/
    ├── logging/components/
    └── trends/components/
```

---

## 🔗 Navigation Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `page.tsx` | Redirects to /dashboard |
| `/dashboard` | `dashboard/page.tsx` | Daily stats & summary |
| `/logging` | `logging/page.tsx` | Food entry management |
| `/trends` | `trends/page.tsx` | Analytics & trends |

---

## 🎯 Next Additions

To make it functional, you'd typically add:

1. **Form Component**
   ```tsx
   // src/components/FoodEntryForm.tsx
   ```

2. **Database Functions**
   ```ts
   // src/lib/db.ts - Prisma operations
   ```

3. **State Management** (optional)
   ```tsx
   // Redux, Zustand, or React Context
   ```

4. **API Routes** (optional)
   ```ts
   // src/app/api/entries/route.ts
   ```

---

## 📚 Useful Commands

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Create build
npm start            # Run production server

# Code Quality
npm run lint         # Check for linting errors

# Database
npx prisma migrate dev --name <name>  # Create migration
npx prisma studio                     # Open DB UI
npx prisma generate                   # Regenerate client

# Clean Build
rm -r .next          # Remove build cache
npm run dev          # Rebuild
```

---

## 🌍 Accessing from Other Devices

To access from another device on your network:

```bash
npm run dev -- --hostname 0.0.0.0
```

Then use your machine's IP (e.g., `http://192.168.1.100:3000`)

---

## 💡 Pro Tips

1. **Use Cmd Palette**: Ctrl/Cmd + K in VS Code for navigation
2. **TypeScript Errors**: Check the terminal for helpful error messages
3. **Dark Mode Testing**: Use DevTools to simulate dark preference
4. **Responsive Testing**: Use Firefox/Chrome DevTools mobile emulation
5. **Tailwind IntelliSense**: Install VS Code extension for autocomplete

---

## ❓ Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### TypeScript Errors
- Check `tsconfig.json` paths
- Verify all imports use `@/` alias
- Ensure files have correct extensions (`.tsx` for React)

### Tailwind Classes Not Applying
- Check `tailwind.config.ts` content paths
- Rebuild: `rm -r .next && npm run dev`
- Ensure classes are in watched files

### Theme Not Persisting
- Check browser localStorage
- Verify `ClientThemeProvider` in root layout
- Check console for errors

---

## 📖 Learn More

- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Happy coding! 🚀**
