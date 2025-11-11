// Theme context for managing light/dark/system modes
// Syncs with localStorage and responds to system preference changes

import { useState, useEffect, createContext } from "react";
import type { ReactNode } from "react";


type Theme = 'system' | 'light' | 'dark'
type ThemeContextType = {
  theme: Theme
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
}
interface Props {
  children: ReactNode
}


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Load theme from localStorage or default to system
const initialState = (): Theme => {
  let theme = localStorage.getItem('theme')
  if (!theme) {
    theme = 'system'
  }
  return theme as Theme
}

export const ThemeContextProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState(initialState())

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

  // Update dark class when system preference changes
  const handleMediaQueryChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Sync theme changes to localStorage and DOM
  useEffect(() => {
    if (theme === 'system') {
      localStorage.removeItem('theme')
      mediaQuery.addEventListener('change', handleMediaQueryChange)
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
      else {
        document.documentElement.classList.remove("dark");
      }
      return () => { mediaQuery.removeEventListener('change', handleMediaQueryChange) }
    }
    else if (theme === 'dark') {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add("dark");
    }
    else {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove("dark");
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

