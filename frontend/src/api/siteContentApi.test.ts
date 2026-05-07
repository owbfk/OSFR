import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  FALLBACK_CONTACT_INTRO,
  FALLBACK_INFORMATION_META,
  FALLBACK_SUPPORT_PHONE_INFO,
} from './fallbackData'
import {
  fetchContactIntro,
  fetchInformationMeta,
  fetchSupportPhoneInfo,
  patchContactIntro,
  updateContactIntro,
} from './siteContentApi'
import * as jsonServerClient from './jsonServerClient'

vi.mock('./jsonServerClient', () => ({
  getResource: vi.fn(),
  patchResource: vi.fn(),
  updateResource: vi.fn(),
}))

const mockedGetResource = vi.mocked(jsonServerClient.getResource)
const mockedPatchResource = vi.mocked(jsonServerClient.patchResource)
const mockedUpdateResource = vi.mocked(jsonServerClient.updateResource)

describe('api/siteContentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns API contact intro when fetch succeeds', async () => {
    const payload = FALLBACK_CONTACT_INTRO
    mockedGetResource.mockResolvedValueOnce(payload)

    await expect(fetchContactIntro()).resolves.toEqual(payload)
    expect(mockedGetResource).toHaveBeenCalledWith('/contactIntro')
  })

  it('returns fallback data when API requests fail', async () => {
    mockedGetResource.mockRejectedValue(new Error('network'))

    await expect(fetchContactIntro()).resolves.toBe(FALLBACK_CONTACT_INTRO)
    await expect(fetchSupportPhoneInfo()).resolves.toBe(FALLBACK_SUPPORT_PHONE_INFO)
    await expect(fetchInformationMeta()).resolves.toBe(FALLBACK_INFORMATION_META)
  })

  it('updates and patches contact intro via resource helpers', async () => {
    const fullPayload = FALLBACK_CONTACT_INTRO
    const partialPayload = {
      title: 'Changed',
    }

    mockedUpdateResource.mockResolvedValueOnce(fullPayload)
    mockedPatchResource.mockResolvedValueOnce({ ...fullPayload, ...partialPayload })

    await expect(updateContactIntro(fullPayload)).resolves.toEqual(fullPayload)
    await expect(patchContactIntro(partialPayload)).resolves.toEqual({
      ...fullPayload,
      ...partialPayload,
    })

    expect(mockedUpdateResource).toHaveBeenCalledWith('/contactIntro', undefined, fullPayload)
    expect(mockedPatchResource).toHaveBeenCalledWith('/contactIntro', undefined, partialPayload)
  })
})
