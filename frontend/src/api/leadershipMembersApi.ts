import axiosInstance from './axiosInstance'
import type { LeadershipMember } from '../types/contacts'

const LEADERSHIP_MEMBERS_URL = 'https://69b15ee9adac80b427c4f0ff.mockapi.io/api/leadershipMembers'

export const fetchLeadershipMembers = async (): Promise<LeadershipMember[]> => {
  const response = await axiosInstance.get<LeadershipMember[]>(LEADERSHIP_MEMBERS_URL)
  return response.data
}
