'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Category } from '@/types'

interface HeaderProps {
  categories: Category[]
}

export default function Header({ categories }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="border-b-[3px] border-ink bg-bg sticky top-0 z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-12 py-3 border-b border-border">
        <Link href="/" className="font-serif text-2xl md:text-3xl font-black text-ink leading-none tracking-tight">
          The Itapoá<span className="text-red">.</span>Times
        </Link>
        <span className="hidden md:block text-xs text-muted uppercase tracking-widest">
          {today}
        </span>
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-ink transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-ink transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-ink transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex px-6 md:px-12">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/${cat.slug.current}`}
            className="text-xs font-semibold uppercase tracking-widest text-ink px-4 py-3 border-r border-border first:border-l hover:bg-ink hover:text-bg transition-colors duration-150"
          >
            {cat.title}
          </Link>
        ))}
      </nav>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col border-t border-border">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${cat.slug.current}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold uppercase tracking-widest text-ink px-6 py-3 border-b border-border hover:bg-ink hover:text-bg transition-colors duration-150"
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
