import { useQuery } from '@tanstack/react-query'
import {
  getResource,
  patchResource,
  updateResource,
} from './jsonServerClient'
import type { ContactIntro, InformationMeta, SupportPhoneInfo } from '../types/siteContent'

const CONTACT_INTRO_URL = '/contactIntro'
const SUPPORT_PHONE_INFO_URL = '/supportPhoneInfo'
const INFORMATION_META_URL = '/informationMeta'

export const fetchContactIntro = async (): Promise<ContactIntro> => {
  try {
    return await getResource<ContactIntro>(CONTACT_INTRO_URL)
  } catch {
    const { FALLBACK_CONTACT_INTRO } = await import('./fallbackData')
    return FALLBACK_CONTACT_INTRO
  }
}

export const fetchSupportPhoneInfo = async (): Promise<SupportPhoneInfo> => {
  try {
    return await getResource<SupportPhoneInfo>(SUPPORT_PHONE_INFO_URL)
  } catch {
    const { FALLBACK_SUPPORT_PHONE_INFO } = await import('./fallbackData')
    return FALLBACK_SUPPORT_PHONE_INFO
  }
}

export const fetchInformationMeta = async (): Promise<InformationMeta> => {
  try {
    return await getResource<InformationMeta>(INFORMATION_META_URL)
  } catch {
    const { FALLBACK_INFORMATION_META } = await import('./fallbackData')
    return FALLBACK_INFORMATION_META
  }
}

export const updateContactIntro = async (payload: ContactIntro): Promise<ContactIntro> => {
  return updateResource<ContactIntro, ContactIntro>(CONTACT_INTRO_URL, undefined, payload)
}

export const patchContactIntro = async (payload: Partial<ContactIntro>): Promise<ContactIntro> => {
  return patchResource<ContactIntro, ContactIntro>(CONTACT_INTRO_URL, undefined, payload)
}

export const updateSupportPhoneInfo = async (
  payload: SupportPhoneInfo,
): Promise<SupportPhoneInfo> => {
  return updateResource<SupportPhoneInfo, SupportPhoneInfo>(SUPPORT_PHONE_INFO_URL, undefined, payload)
}

export const patchSupportPhoneInfo = async (
  payload: Partial<SupportPhoneInfo>,
): Promise<SupportPhoneInfo> => {
  return patchResource<SupportPhoneInfo, SupportPhoneInfo>(SUPPORT_PHONE_INFO_URL, undefined, payload)
}

export const updateInformationMeta = async (payload: InformationMeta): Promise<InformationMeta> => {
  return updateResource<InformationMeta, InformationMeta>(INFORMATION_META_URL, undefined, payload)
}

export const patchInformationMeta = async (
  payload: Partial<InformationMeta>,
): Promise<InformationMeta> => {
  return patchResource<InformationMeta, InformationMeta>(INFORMATION_META_URL, undefined, payload)
}

export const useContactIntro = () => {
  return useQuery({
    queryKey: ['contactIntro'],
    queryFn: fetchContactIntro,
  })
}

export const useSupportPhoneInfo = () => {
  return useQuery({
    queryKey: ['supportPhoneInfo'],
    queryFn: fetchSupportPhoneInfo,
  })
}

export const useInformationMeta = () => {
  return useQuery({
    queryKey: ['informationMeta'],
    queryFn: fetchInformationMeta,
  })
}
