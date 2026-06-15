'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, Clock, CheckSquare, BarChart2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Főoldal' },
  { href: '/tranzakciok', icon: ArrowLeftRight, label: 'Tételek' },
  { href: '/sessiok', icon: Clock, label: 'Munka' },
  { href: '/feladatok', icon: CheckSquare, label: 'Feladatok' },
  { href: '/riportok', icon: BarChart2, label: 'Riportok' },
  { href: '/beallitasok', icon: Settings, label: 'Beáll.' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="max-w-2xl mx-auto flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors',
                active ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
