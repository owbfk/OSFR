import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { NewsItem } from '../types/news'

const API_URL = import.meta.env.VITE_API_URL

export const fetchNews = async (): Promise<NewsItem[]> => {
  const { data } = await axios.get(`${API_URL}/news`)
  return data
}

export const fetchNewsById = async (id: string): Promise<NewsItem> => {
  const { data } = await axios.get(`${API_URL}/news/${id}`)
  return data
}

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews
  })
}

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchNewsById(id)
  })
}