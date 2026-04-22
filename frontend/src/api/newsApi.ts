import { useQuery } from '@tanstack/react-query'
import {
  createResource,
  getResourceById,
  listResource,
  patchResource,
  removeResource,
  updateResource,
} from './jsonServerClient'
import { FALLBACK_NEWS } from './fallbackData'
import type { NewsItem } from '../types/news'

const NEWS_URL = '/news'

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    return await listResource<NewsItem>(NEWS_URL)
  } catch {
    return FALLBACK_NEWS
  }
}

export const fetchNewsById = async (id: string): Promise<NewsItem> => {
  if (!id) {
    throw new Error('News id is required')
  }

  try {
    return await getResourceById<NewsItem>(NEWS_URL, id)
  } catch {
    const item = FALLBACK_NEWS.find((entry) => entry.id === Number(id))

    if (!item) {
      throw new Error(`News with id "${id}" not found`)
    }

    return item
  }
}

export const createNewsItem = async (payload: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
  return createResource<Omit<NewsItem, 'id'>, NewsItem>(NEWS_URL, payload)
}

export const updateNewsItem = async (id: string | number, payload: NewsItem): Promise<NewsItem> => {
  return updateResource<NewsItem, NewsItem>(NEWS_URL, id, payload)
}

export const patchNewsItem = async (
  id: string | number,
  payload: Partial<NewsItem>,
): Promise<NewsItem> => {
  return patchResource<NewsItem, NewsItem>(NEWS_URL, id, payload)
}

export const deleteNewsItem = async (id: string | number): Promise<void> => {
  return removeResource(NEWS_URL, id)
}

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  })
}

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchNewsById(id),
    enabled: Boolean(id),
  })
}
