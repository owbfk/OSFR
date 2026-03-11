import { useQuery } from '@tanstack/react-query'
import { fetchLeadershipMembers } from '../api/leadershipMembersApi'

export const useLeadershipMembers = () => {
  return useQuery({
    queryKey: ['leadershipMembers'],
    queryFn: fetchLeadershipMembers,
  })
}
