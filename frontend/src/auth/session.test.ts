import { describe, expect, it, vi } from 'vitest'
import {
  AUTH_EVENT_NAME,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearAuthSession,
  clearStoredToken,
  clearStoredUser,
  dispatchAuthChange,
  getStoredToken,
  getStoredUser,
  isStoredTokenExpired,
  parseAuthTokenPayload,
  setAuthSession,
  setStoredToken,
  setStoredUser,
} from './session'

const createToken = (payload: Record<string, unknown>): string => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return `header.${encodedPayload}.signature`
}

describe('auth/session', () => {
  it('stores and clears auth token in localStorage', () => {
    expect(getStoredToken()).toBeNull()

    setStoredToken('abc123')
    expect(getStoredToken()).toBe('abc123')

    clearStoredToken()
    expect(getStoredToken()).toBeNull()
  })

  it('stores and restores valid user payload', () => {
    setStoredUser({ id: 10, email: 'user@example.com', name: 'User Name' })

    expect(getStoredUser()).toEqual({
      id: 10,
      email: 'user@example.com',
      name: 'User Name',
    })
  })

  it('returns null for invalid or malformed stored user', () => {
    window.localStorage.setItem(AUTH_USER_KEY, '{bad-json}')
    expect(getStoredUser()).toBeNull()

    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ id: 1 }))
    expect(getStoredUser()).toBeNull()
  })

  it('parses JWT payload encoded in base64url format', () => {
    const token = createToken({ sub: '42', email: 'mail@example.com', exp: 1735689600 })

    expect(parseAuthTokenPayload(token)).toEqual({
      sub: '42',
      email: 'mail@example.com',
      exp: 1735689600,
    })
  })

  it('returns null when token payload cannot be parsed', () => {
    expect(parseAuthTokenPayload('wrong-token')).toBeNull()
  })

  it('marks token as expired when there is no token', () => {
    expect(isStoredTokenExpired()).toBe(true)
  })

  it('marks token as valid when exp is in the future', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600
    setStoredToken(createToken({ exp: futureExp }))

    expect(isStoredTokenExpired()).toBe(false)
  })

  it('marks token as expired when exp is in the past', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 10
    setStoredToken(createToken({ exp: pastExp }))

    expect(isStoredTokenExpired()).toBe(true)
  })

  it('dispatches auth changed event for explicit dispatch and session helpers', () => {
    const handler = vi.fn()
    window.addEventListener(AUTH_EVENT_NAME, handler)

    dispatchAuthChange()
    setAuthSession('token-value', { id: 'u1', email: 'u1@example.com' })
    clearAuthSession()

    expect(handler).toHaveBeenCalledTimes(3)
    expect(window.localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(window.localStorage.getItem(AUTH_USER_KEY)).toBeNull()

    window.removeEventListener(AUTH_EVENT_NAME, handler)
  })

  it('clears stored user explicitly', () => {
    setStoredUser({ id: 1, email: 'clear@example.com' })
    clearStoredUser()

    expect(getStoredUser()).toBeNull()
  })
})
