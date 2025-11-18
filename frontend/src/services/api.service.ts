import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/constants'
import type { ErrorResponse } from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (optional: can add loading state here)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Request is sent with cookies automatically due to withCredentials: true
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response
  },
  (error: AxiosError<ErrorResponse>) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred'

      // You can handle specific status codes here
      if (error.response.status === 401) {
        // Unauthorized - could redirect to login
        console.error('Unauthorized - please login')
      }

      if (error.response.status === 403) {
        // Forbidden
        console.error('Access forbidden')
      }

      // Throw error with message
      throw new Error(errorMessage)
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.')
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

export default api
