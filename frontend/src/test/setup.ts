import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  document.body.className = ''
  delete document.body.dataset.accessibleScheme
  delete document.body.dataset.accessibleFontSize
})
