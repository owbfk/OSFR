export type AppealStatus = 'new'

export interface AppealItem {
  id: number
  userId: number | string
  userEmail: string
  userName?: string
  subject: string
  message: string
  phone: string
  email: string
  preferredContact: 'email' | 'phone'
  status: AppealStatus
  createdAt: string
}

export type CreateAppealPayload = Omit<AppealItem, 'id'>
