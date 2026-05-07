import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from './ThemeContext'
import { useTheme } from './useTheme'

const ThemeControls = () => {
  const { enabled, scheme, fontSize, hideImages, setEnabled, setScheme, setFontSize, setHideImages } =
    useTheme()

  return (
    <div>
      <p>{`enabled:${enabled}`}</p>
      <p>{`scheme:${scheme}`}</p>
      <p>{`font:${fontSize}`}</p>
      <p>{`hide:${hideImages}`}</p>
      <button type="button" onClick={() => setEnabled(true)}>
        enable
      </button>
      <button type="button" onClick={() => setScheme('black-white')}>
        black-white
      </button>
      <button type="button" onClick={() => setFontSize('large')}>
        large-font
      </button>
      <button type="button" onClick={() => setHideImages(true)}>
        hide-images
      </button>
    </div>
  )
}

describe('context/ThemeProvider + useTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('applies accessibility classes and body dataset according to state', () => {
    render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    expect(document.body).not.toHaveClass('accessible-enabled')
    expect(document.body.dataset.accessibleScheme).toBe('default')
    expect(document.body.dataset.accessibleFontSize).toBe('normal')

    fireEvent.click(screen.getByRole('button', { name: 'enable' }))
    fireEvent.click(screen.getByRole('button', { name: 'black-white' }))
    fireEvent.click(screen.getByRole('button', { name: 'large-font' }))
    fireEvent.click(screen.getByRole('button', { name: 'hide-images' }))

    expect(document.body).toHaveClass('accessible-enabled')
    expect(document.body).toHaveClass('accessible-hide-images')
    expect(document.body.dataset.accessibleScheme).toBe('black-white')
    expect(document.body.dataset.accessibleFontSize).toBe('large')
  })

  it('cleans body classes and dataset on unmount', () => {
    const { unmount } = render(
      <ThemeProvider>
        <ThemeControls />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'enable' }))
    expect(document.body).toHaveClass('accessible-enabled')

    unmount()

    expect(document.body).not.toHaveClass('accessible-enabled')
    expect(document.body).not.toHaveClass('accessible-hide-images')
    expect(document.body.dataset.accessibleScheme).toBeUndefined()
    expect(document.body.dataset.accessibleFontSize).toBeUndefined()
  })

  it('throws clear error when useTheme is used outside provider', () => {
    const ThemeConsumer = () => {
      useTheme()
      return null
    }

    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be used within ThemeProvider')
  })
})
