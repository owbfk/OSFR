import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  timeout: 5000,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', config.url)
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status)
    return Promise.reject(error)
  }
)

export default axiosInstance
