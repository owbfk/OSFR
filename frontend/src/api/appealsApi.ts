import axios from 'axios'
import { createResource } from './jsonServerClient'
import type { AppealItem, CreateAppealPayload } from '../types/appeal'

const APPEALS_URL = '/appeals'

const APPEALS_ERROR_MESSAGES: Record<string, string> = {
  'Missing authorization header': 'Сессия истекла. Войдите снова.',
  'Incorrect authorization scheme': 'Сессия истекла. Войдите снова.',
  'Missing token': 'Сессия истекла. Войдите снова.',
  'Private resource creation: request body must have a reference to the owner id':
    'Не удалось подтвердить пользователя для отправки обращения.',
}

const mapAppealError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'Не удалось отправить обращение. Попробуйте позже.'
  }
  const responseData = error.response?.data
  if (typeof responseData === 'string' && responseData.trim()) {
    return APPEALS_ERROR_MESSAGES[responseData] ?? responseData
  }
  return 'Не удалось отправить обращение. Попробуйте позже.'
}

export const createAppeal = async (payload: CreateAppealPayload): Promise<AppealItem> => {
  try {
    return await createResource<CreateAppealPayload, AppealItem>(APPEALS_URL, payload)
  } catch (error) {
    throw new Error(mapAppealError(error))
  }
}
