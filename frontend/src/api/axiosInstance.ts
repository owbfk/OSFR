import axios from 'axios'
import { clearAuthSession, getStoredToken, isStoredTokenExpired } from '../auth/session'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (!token) {
      return config
    }
    if (isStoredTokenExpired()) {
      clearAuthSession()
      return config
    }
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      clearAuthSession()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
