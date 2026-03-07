import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type AccessibleFontSize, type AccessibleScheme } from './themeStore'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(false)
  const [scheme, setScheme] = useState<AccessibleScheme>('default')
  const [fontSize, setFontSize] = useState<AccessibleFontSize>('normal')
  const [hideImages, setHideImages] = useState(false)

  useEffect(() => {
    const body = document.body

    body.classList.toggle('accessible-enabled', enabled)
    body.classList.toggle('accessible-hide-images', enabled && hideImages)
    body.dataset.accessibleScheme = enabled ? scheme : 'default'
    body.dataset.accessibleFontSize = enabled ? fontSize : 'normal'

    return () => {
      body.classList.remove('accessible-enabled', 'accessible-hide-images')
      delete body.dataset.accessibleScheme
      delete body.dataset.accessibleFontSize
    }
  }, [enabled, scheme, fontSize, hideImages])

  const value = useMemo(
    () => ({
      enabled,
      scheme,
      fontSize,
      hideImages,
      setEnabled,
      setScheme,
      setFontSize,
      setHideImages,
    }),
    [enabled, scheme, fontSize, hideImages],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

