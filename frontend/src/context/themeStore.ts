import { createContext } from 'react'

export type AccessibleScheme = 'default' | 'black-white' | 'white-black'
export type AccessibleFontSize = 'normal' | 'large'

export interface ThemeContextProps {
  enabled: boolean
  scheme: AccessibleScheme
  fontSize: AccessibleFontSize
  hideImages: boolean
  setEnabled: (value: boolean) => void
  setScheme: (value: AccessibleScheme) => void
  setFontSize: (value: AccessibleFontSize) => void
  setHideImages: (value: boolean) => void
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)
