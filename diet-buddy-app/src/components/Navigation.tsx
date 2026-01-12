"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/logging", label: "Log", icon: "📝" },
  { href: "/trends", label: "Trends", icon: "📈" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 glass border-r border-white/20 flex-col p-6 gap-8">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🥗</div>
          <h1 className="text-xl font-bold">Diet Buddy</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "glass bg-white/10 dark:bg-white/20 font-semibold"
                    : "hover:bg-white/5 dark:hover:bg-white/10"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Theme
          </span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/20 flex justify-around items-center px-4 py-2 h-20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "glass bg-white/10 dark:bg-white/20"
                  : "hover:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => {
            // Theme toggle on mobile
            document.documentElement.classList.toggle("dark");
          }}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/5 dark:hover:bg-white/10"
        >
          <span className="text-2xl">🌙</span>
          <span className="text-xs font-medium">Theme</span>
        </button>
      </nav>
    </>
  );
}
