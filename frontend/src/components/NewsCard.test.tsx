import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NewsCard } from './NewsCard'
import type { NewsItem } from '../types/news'

describe('components/NewsCard', () => {
  it('renders link and image from provided news data', () => {
    const news: NewsItem = {
      id: 12,
      title: 'Important title',
      description: 'Short description',
      content: 'Full content',
      image: 'https://example.com/news.png',
      date: '2026-05-02',
    }

    render(
      <MemoryRouter>
        <NewsCard news={news} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link')
    const image = screen.getByRole('img', { name: 'Important title' })

    expect(link).toHaveAttribute('href', '/news/12')
    expect(image).toHaveAttribute('src', 'https://example.com/news.png')
  })

  it('uses safe fallback values for empty display fields', () => {
    const news: NewsItem = {
      id: 5,
      title: '   ',
      description: '   ',
      content: 'Hidden content',
      image: '   ',
      date: '   ',
    }

    render(
      <MemoryRouter>
        <NewsCard news={news} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link')
    const image = screen.getByRole('img')
    const heading = screen.getByRole('heading', { level: 3 })

    expect(link).toHaveAttribute('href', '/news/5')
    expect(image.getAttribute('src')).toContain('data:image/svg+xml')
    expect(heading.textContent?.trim().length).toBeGreaterThan(0)
    expect(image.getAttribute('alt')?.trim().length).toBeGreaterThan(0)
  })
})
