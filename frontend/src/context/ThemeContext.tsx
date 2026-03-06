import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface ThemeContextProps {
  isAccessible: boolean
  toggleAccessible: () => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isAccessible, setIsAccessible] = useState(false)

  const toggleAccessible = () => {
    setIsAccessible(prev => !prev)
  }

  useEffect(() => {
    if (isAccessible) {
      document.body.classList.add("accessible-mode")
    } else {
      document.body.classList.remove("accessible-mode")
    }
  }, [isAccessible])

  return (
    <ThemeContext.Provider value={{ isAccessible, toggleAccessible }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}