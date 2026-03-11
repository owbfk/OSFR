import axiosInstance from './axiosInstance'
import type { RegionContact } from '../types/contacts'

const REGION_CONTACTS_URL = 'https://69b15ee9adac80b427c4f0ff.mockapi.io/api/RegionContact'

export const fetchRegionContacts = async (): Promise<RegionContact[]> => {
  const response = await axiosInstance.get<RegionContact[]>(REGION_CONTACTS_URL)
  return response.data
}
