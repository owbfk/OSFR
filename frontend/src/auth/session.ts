export const AUTH_TOKEN_KEY = 'sfr_auth_token'
export const AUTH_EVENT_NAME = 'auth:changed'
export const AUTH_USER_KEY = 'sfr_auth_user'

export type AuthUser = {
  id: string | number
  email: string
  name?: string
}

type AuthTokenPayload = {
  sub?: string
  email?: string
  exp?: number
}

const isBrowser = () => typeof window !== 'undefined'

const readStorage = (key: string): string | null => {
  if (!isBrowser()) return null

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStorage = (key: string, value: string) => {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(key, value)
  } catch {
    return
  }
}

const removeStorage = (key: string) => {
  if (!isBrowser()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}

export const getStoredToken = (): string | null => {
  return readStorage(AUTH_TOKEN_KEY)
}

export const setStoredToken = (token: string) => {
  writeStorage(AUTH_TOKEN_KEY, token)
}

export const clearStoredToken = () => {
  removeStorage(AUTH_TOKEN_KEY)
}

export const getStoredUser = (): AuthUser | null => {
  const rawUser = readStorage(AUTH_USER_KEY)
  if (!rawUser) return null

  try {
    const parsedUser = JSON.parse(rawUser) as Partial<AuthUser>

    if (!parsedUser || parsedUser.id === undefined || typeof parsedUser.email !== 'string') {
      return null
    }

    return {
      id: parsedUser.id,
      email: parsedUser.email,
      name: typeof parsedUser.name === 'string' ? parsedUser.name : undefined,
    }
  } catch {
    return null
  }
}

export const setStoredUser = (user: AuthUser) => {
  writeStorage(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearStoredUser = () => {
  removeStorage(AUTH_USER_KEY)
}

export const dispatchAuthChange = () => {
  if (!isBrowser()) return
  window.dispatchEvent(new Event(AUTH_EVENT_NAME))
}

export const setAuthSession = (token: string, user: AuthUser) => {
  setStoredToken(token)
  setStoredUser(user)
  dispatchAuthChange()
}

export const clearAuthSession = () => {
  clearStoredToken()
  clearStoredUser()
  dispatchAuthChange()
}

const parseTokenPart = (value: string): string => {
  const paddedValue = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=')
  return paddedValue.replace(/-/g, '+').replace(/_/g, '/')
}

export const parseAuthTokenPayload = (token: string): AuthTokenPayload | null => {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const decodedPayload = atob(parseTokenPart(payload))
    return JSON.parse(decodedPayload) as AuthTokenPayload
  } catch {
    return null
  }
}

export const isStoredTokenExpired = (): boolean => {
  const token = getStoredToken()
  if (!token) return true

  const payload = parseAuthTokenPayload(token)
  if (!payload) return true
  if (!payload.exp) return false

  return payload.exp * 1000 <= Date.now()
}
