import type { RegionContact } from '../types/contacts'
import {
  createResource,
  listResource,
  patchResource,
  removeResource,
  updateResource,
} from './jsonServerClient'

const REGION_CONTACTS_URL = '/regionContacts'

export const fetchRegionContacts = async (): Promise<RegionContact[]> => {
  try {
    return await listResource<RegionContact>(REGION_CONTACTS_URL)
  } catch {
    const { FALLBACK_REGION_CONTACTS } = await import('./fallbackData')
    return FALLBACK_REGION_CONTACTS
  }
}

export const createRegionContact = async (
  payload: Omit<RegionContact, 'id'>,
): Promise<RegionContact> => {
  return createResource<Omit<RegionContact, 'id'>, RegionContact>(REGION_CONTACTS_URL, payload)
}

export const updateRegionContact = async (
  id: string | number,
  payload: RegionContact,
): Promise<RegionContact> => {
  return updateResource<RegionContact, RegionContact>(REGION_CONTACTS_URL, id, payload)
}

export const patchRegionContact = async (
  id: string | number,
  payload: Partial<RegionContact>,
): Promise<RegionContact> => {
  return patchResource<RegionContact, RegionContact>(REGION_CONTACTS_URL, id, payload)
}

export const deleteRegionContact = async (id: string | number): Promise<void> => {
  return removeResource(REGION_CONTACTS_URL, id)
}
