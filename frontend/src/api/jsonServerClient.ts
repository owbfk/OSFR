import type { AxiosRequestConfig } from 'axios'
import axiosInstance from './axiosInstance'

export type JsonEntityId = string | number

const buildPath = (resource: string, id?: JsonEntityId): string => {
  if (id === undefined || id === null || id === '') {
    return resource
  }

  return `${resource}/${id}`
}

export const listResource = async <T>(
  resource: string,
  config?: AxiosRequestConfig,
): Promise<T[]> => {
  const response = await axiosInstance.get<T[]>(resource, config)
  return response.data
}

export const getResource = async <T>(resource: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.get<T>(resource, config)
  return response.data
}

export const getResourceById = async <T>(resource: string, id: JsonEntityId): Promise<T> => {
  const response = await axiosInstance.get<T>(buildPath(resource, id))
  return response.data
}

export const createResource = async <TInput, TOutput = TInput>(
  resource: string,
  payload: TInput,
): Promise<TOutput> => {
  const response = await axiosInstance.post<TOutput>(resource, payload)
  return response.data
}

export const updateResource = async <TInput, TOutput = TInput>(
  resource: string,
  id: JsonEntityId | undefined,
  payload: TInput,
): Promise<TOutput> => {
  const response = await axiosInstance.put<TOutput>(buildPath(resource, id), payload)
  return response.data
}

export const patchResource = async <TInput, TOutput = TInput>(
  resource: string,
  id: JsonEntityId | undefined,
  payload: Partial<TInput>,
): Promise<TOutput> => {
  const response = await axiosInstance.patch<TOutput>(buildPath(resource, id), payload)
  return response.data
}

export const removeResource = async (resource: string, id: JsonEntityId | undefined): Promise<void> => {
  await axiosInstance.delete(buildPath(resource, id))
}
