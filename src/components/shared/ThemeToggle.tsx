'use client'

import React, { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Respect system preference on first load
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const stored = localStorage.getItem('eureka-theme')
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('eureka-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={dark ? 'Switch to Light Theme' : 'Switch to Dark Navy Theme'}
      aria-label={dark ? 'Switch to Light Theme' : 'Switch to Dark Navy Theme'}
      className="w-9 h-9 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] relative flex items-center justify-center transition-colors cursor-pointer border border-[var(--border-standard)]"
    >
      {dark ? (
        <SunIcon className="w-4 h-4 text-amber-400" />
      ) : (
        <MoonIcon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  )
}

export default ThemeToggle
