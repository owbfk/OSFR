import { useQuery } from '@tanstack/react-query'
import type { NewsItem } from '../types/news'

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Изменения законодательства',
    description: 'Обновлены правила назначения выплат.',
    content: '',
    image: '',
    date: '2025-05-10',
  },
  {
    id: 2,
    title: 'График работы',
    description: 'Изменён режим работы.',
    content: '',
    image: '',
    date: '2025-05-08',
  },
]

export const fetchNews = async (): Promise<NewsItem[]> => {
  const response = await new Promise<{ data: NewsItem[] }>((resolve) => {
    setTimeout(() => {
      resolve({ data: MOCK_NEWS })
    }, 1000)
  })

  return response.data
}

export const fetchNewsById = async (id: string): Promise<NewsItem> => {
  const news = await fetchNews()
  const item = news.find((entry) => entry.id === Number(id))

  if (!item) {
    throw new Error(`News with id "${id}" not found`)
  }

  return item
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