import { useQuery } from '@tanstack/react-query'
import {
  createResource,
  getResourceById,
  listResource,
  patchResource,
  removeResource,
  updateResource,
} from './jsonServerClient'
import type { InformationItem } from '../types/information'

const INFORMATION_URL = '/information'

export const fetchInformation = async (): Promise<InformationItem[]> => {
  try {
    return await listResource<InformationItem>(INFORMATION_URL)
  } catch {
    const { FALLBACK_INFORMATION } = await import('./fallbackData')
    return FALLBACK_INFORMATION
  }
}

export const fetchInformationById = async (id: string): Promise<InformationItem> => {
  if (!id) {
    throw new Error('Information id is required')
  }

  try {
    return await getResourceById<InformationItem>(INFORMATION_URL, id)
  } catch {
    const { FALLBACK_INFORMATION } = await import('./fallbackData')
    const item = FALLBACK_INFORMATION.find((entry) => entry.id === Number(id))

    if (!item) {
      throw new Error(`Information item with id "${id}" not found`)
    }

    return item
  }
}

export const createInformationItem = async (
  payload: Omit<InformationItem, 'id'>,
): Promise<InformationItem> => {
  return createResource<Omit<InformationItem, 'id'>, InformationItem>(INFORMATION_URL, payload)
}

export const updateInformationItem = async (
  id: string | number,
  payload: InformationItem,
): Promise<InformationItem> => {
  return updateResource<InformationItem, InformationItem>(INFORMATION_URL, id, payload)
}

export const patchInformationItem = async (
  id: string | number,
  payload: Partial<InformationItem>,
): Promise<InformationItem> => {
  return patchResource<InformationItem, InformationItem>(INFORMATION_URL, id, payload)
}

export const deleteInformationItem = async (id: string | number): Promise<void> => {
  return removeResource(INFORMATION_URL, id)
}

export const useInformation = () => {
  return useQuery({
    queryKey: ['information'],
    queryFn: fetchInformation,
  })
}

export const useInformationById = (id: string) => {
  return useQuery({
    queryKey: ['information', id],
    queryFn: () => fetchInformationById(id),
    enabled: Boolean(id),
  })
}
