"use client"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/compose", label: "Compose" },
    { href: "/studio", label: "Studio" },
    { href: "/mixer", label: "Mixer" },
    { href: "/neural", label: "Neural" },
    { href: "/catalog", label: "Catalog" },
    { href: "/sessions", label: "Sessions" },
    { href: "/receipts", label: "Receipts" },
    { href: "/health", label: "Health" },
  ]

  return (
    <nav className="border-b border-amber-900/20 backdrop-blur bg-[#1a0b00]/80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-amber-500 tracking-wider">
            THE DEN HOUSE
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-amber-500/20 text-amber-200"
                      : "text-amber-100/60 hover:text-amber-100 hover:bg-amber-500/10"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
              Help
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition-colors">
              Account
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
