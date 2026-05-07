import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FALLBACK_NEWS } from './fallbackData'
import { fetchNews, fetchNewsById } from './newsApi'
import * as jsonServerClient from './jsonServerClient'
import type { NewsItem } from '../types/news'

vi.mock('./jsonServerClient', () => ({
  listResource: vi.fn(),
  getResourceById: vi.fn(),
  createResource: vi.fn(),
  updateResource: vi.fn(),
  patchResource: vi.fn(),
  removeResource: vi.fn(),
}))

const mockedListResource = vi.mocked(jsonServerClient.listResource)
const mockedGetResourceById = vi.mocked(jsonServerClient.getResourceById)

describe('api/newsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns API news list when request succeeds', async () => {
    const apiNews: NewsItem[] = [
      {
        id: 101,
        title: 'title',
        description: 'description',
        content: 'content',
        image: '/image.jpg',
        date: '2026-01-01',
      },
    ]

    mockedListResource.mockResolvedValueOnce(apiNews)

    await expect(fetchNews()).resolves.toEqual(apiNews)
    expect(mockedListResource).toHaveBeenCalledWith('/news')
  })

  it('returns fallback news list when API request fails', async () => {
    mockedListResource.mockRejectedValueOnce(new Error('network'))

    await expect(fetchNews()).resolves.toBe(FALLBACK_NEWS)
  })

  it('throws when id is empty', async () => {
    await expect(fetchNewsById('')).rejects.toThrow('News id is required')
  })

  it('returns API news item by id when request succeeds', async () => {
    const apiItem: NewsItem = {
      id: 5,
      title: 'title',
      description: 'description',
      content: 'content',
      image: '/image.jpg',
      date: '2026-01-02',
    }

    mockedGetResourceById.mockResolvedValueOnce(apiItem)

    await expect(fetchNewsById('5')).resolves.toEqual(apiItem)
    expect(mockedGetResourceById).toHaveBeenCalledWith('/news', '5')
  })

  it('returns fallback news item when API fails and fallback contains id', async () => {
    const fallbackItem = FALLBACK_NEWS[0]
    mockedGetResourceById.mockRejectedValueOnce(new Error('network'))

    await expect(fetchNewsById(String(fallbackItem.id))).resolves.toEqual(fallbackItem)
  })

  it('throws when API fails and fallback does not contain id', async () => {
    mockedGetResourceById.mockRejectedValueOnce(new Error('network'))

    await expect(fetchNewsById('999999')).rejects.toThrow('News with id "999999" not found')
  })
})
