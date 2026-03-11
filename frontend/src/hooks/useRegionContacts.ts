import { useQuery } from '@tanstack/react-query'
import { fetchRegionContacts } from '../api/regionContactsApi'

export const useRegionContacts = () => {
  return useQuery({
    queryKey: ['regionContacts'],
    queryFn: fetchRegionContacts,
  })
}
