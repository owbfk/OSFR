import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createResource,
  getResource,
  getResourceById,
  listResource,
  patchResource,
  removeResource,
  updateResource,
} from './jsonServerClient'
import axiosInstance from './axiosInstance'

vi.mock('./axiosInstance', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedAxios = vi.mocked(axiosInstance)

describe('api/jsonServerClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists a resource via GET and returns response data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1 }] })

    const result = await listResource<{ id: number }>('/items')

    expect(mockedAxios.get).toHaveBeenCalledWith('/items', undefined)
    expect(result).toEqual([{ id: 1 }])
  })

  it('loads a single resource via GET and returns response data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { value: 'ok' } })

    const result = await getResource<{ value: string }>('/meta')

    expect(mockedAxios.get).toHaveBeenCalledWith('/meta', undefined)
    expect(result).toEqual({ value: 'ok' })
  })

  it('loads entity by id and appends id to path', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 7 } })

    const result = await getResourceById<{ id: number }>('/items', 7)

    expect(mockedAxios.get).toHaveBeenCalledWith('/items/7')
    expect(result).toEqual({ id: 7 })
  })

  it('creates entity via POST', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, name: 'new' } })

    const result = await createResource<{ name: string }, { id: number; name: string }>('/items', {
      name: 'new',
    })

    expect(mockedAxios.post).toHaveBeenCalledWith('/items', { name: 'new' })
    expect(result).toEqual({ id: 1, name: 'new' })
  })

  it('updates entity via PUT using base path when id is undefined', async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: { ok: true } })

    const result = await updateResource<{ value: string }, { ok: boolean }>(
      '/settings',
      undefined,
      {
        value: 'x',
      },
    )

    expect(mockedAxios.put).toHaveBeenCalledWith('/settings', { value: 'x' })
    expect(result).toEqual({ ok: true })
  })

  it('patches entity via PATCH using id path when id is provided', async () => {
    mockedAxios.patch.mockResolvedValueOnce({ data: { id: 3, value: 'patched' } })

    const result = await patchResource<{ value: string }, { id: number; value: string }>(
      '/items',
      3,
      {
        value: 'patched',
      },
    )

    expect(mockedAxios.patch).toHaveBeenCalledWith('/items/3', { value: 'patched' })
    expect(result).toEqual({ id: 3, value: 'patched' })
  })

  it('deletes entity via DELETE with computed path', async () => {
    mockedAxios.delete.mockResolvedValueOnce(undefined)

    await removeResource('/items', 'a1')

    expect(mockedAxios.delete).toHaveBeenCalledWith('/items/a1')
  })
})
