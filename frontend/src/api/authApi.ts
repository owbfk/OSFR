import axios from 'axios'
import axiosInstance from './axiosInstance'
import { parseAuthTokenPayload, type AuthUser } from '../auth/session'

type AuthCredentials = {
  email: string
  password: string
}

type RegisterCredentials = AuthCredentials & {
  name?: string
}

type RawAuthUser = {
  id: string | number
  email: string
  name?: string
}

type RawAuthResponse = {
  accessToken?: string
  user?: RawAuthUser
}

type AuthResult = {
  accessToken: string
  user: AuthUser
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'Email and password are required': 'Укажите email и пароль.',
  'Email format is invalid': 'Неверный формат email.',
  'Password is too short': 'Пароль должен быть не короче 6 символов.',
  'Email already exists': 'Пользователь с таким email уже существует.',
  'Cannot find user': 'Пользователь с таким email не найден.',
  'Incorrect password': 'Неверный пароль.',
}

const normalizeUser = (rawUser: RawAuthResponse['user'], accessToken: string): AuthUser => {
  if (rawUser && (typeof rawUser.id === 'string' || typeof rawUser.id === 'number') && typeof rawUser.email === 'string') {
    return {
      id: rawUser.id,
      email: rawUser.email,
      name: typeof rawUser.name === 'string' ? rawUser.name : undefined,
    }
  }

  const tokenPayload = parseAuthTokenPayload(accessToken)
  if (!tokenPayload?.sub || !tokenPayload.email) {
    throw new Error('Не удалось получить данные пользователя из ответа сервера.')
  }

  const parsedId = Number(tokenPayload.sub)
  const userId = Number.isNaN(parsedId) ? tokenPayload.sub : parsedId

  return {
    id: userId,
    email: tokenPayload.email,
  }
}

const normalizeAuthResponse = (data: RawAuthResponse): AuthResult => {
  if (!data.accessToken) {
    throw new Error('Сервер не вернул токен авторизации.')
  }

  return {
    accessToken: data.accessToken,
    user: normalizeUser(data.user, data.accessToken),
  }
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage
  }

  const responseData = error.response?.data
  if (typeof responseData === 'string' && responseData.trim()) {
    return AUTH_ERROR_MESSAGES[responseData] ?? responseData
  }

  return fallbackMessage
}

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResult> => {
  try {
    const response = await axiosInstance.post<RawAuthResponse>('register', credentials)
    return normalizeAuthResponse(response.data)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Не удалось зарегистрироваться. Попробуйте позже.'))
  }
}

export const loginUser = async (credentials: AuthCredentials): Promise<AuthResult> => {
  try {
    const response = await axiosInstance.post<RawAuthResponse>('login', credentials)
    return normalizeAuthResponse(response.data)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Не удалось выполнить вход. Попробуйте позже.'))
  }
}
