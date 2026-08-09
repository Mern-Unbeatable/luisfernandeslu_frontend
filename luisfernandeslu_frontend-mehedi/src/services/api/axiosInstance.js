import axios from 'axios'
import { env } from '../../config/env'
import { setupInterceptors } from './interceptors'

export const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

setupInterceptors(axiosInstance)

export default axiosInstance