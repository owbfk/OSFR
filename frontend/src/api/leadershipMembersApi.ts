import type { LeadershipMember } from '../types/contacts'
import {
  createResource,
  listResource,
  patchResource,
  removeResource,
  updateResource,
} from './jsonServerClient'
import { FALLBACK_LEADERSHIP_MEMBERS } from './fallbackData'

const LEADERSHIP_MEMBERS_URL = '/leadershipMembers'

export const fetchLeadershipMembers = async (): Promise<LeadershipMember[]> => {
  try {
    return await listResource<LeadershipMember>(LEADERSHIP_MEMBERS_URL)
  } catch {
    return FALLBACK_LEADERSHIP_MEMBERS
  }
}

export const createLeadershipMember = async (
  payload: Omit<LeadershipMember, 'id'>,
): Promise<LeadershipMember> => {
  return createResource<Omit<LeadershipMember, 'id'>, LeadershipMember>(LEADERSHIP_MEMBERS_URL, payload)
}

export const updateLeadershipMember = async (
  id: string | number,
  payload: LeadershipMember,
): Promise<LeadershipMember> => {
  return updateResource<LeadershipMember, LeadershipMember>(LEADERSHIP_MEMBERS_URL, id, payload)
}

export const patchLeadershipMember = async (
  id: string | number,
  payload: Partial<LeadershipMember>,
): Promise<LeadershipMember> => {
  return patchResource<LeadershipMember, LeadershipMember>(LEADERSHIP_MEMBERS_URL, id, payload)
}

export const deleteLeadershipMember = async (id: string | number): Promise<void> => {
  return removeResource(LEADERSHIP_MEMBERS_URL, id)
}
