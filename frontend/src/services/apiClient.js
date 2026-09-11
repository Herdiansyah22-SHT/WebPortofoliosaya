import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { Accept: 'application/json' },
  timeout: 15_000,
  withCredentials: true,
  withXSRFToken: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

/** Ekstrak error API menjadi { message, errors } dengan pesan ramah. */
export function extractApiError(error) {
  const data = error.response?.data
  if (data?.message) {
    return { message: data.message, errors: data.errors || {} }
  }
  if (error.code === 'ECONNABORTED') {
    return { message: 'Waktu permintaan habis. Coba lagi.', errors: {} }
  }
  if (!error.response) {
    return { message: 'Tidak dapat terhubung ke server. Coba lagi.', errors: {} }
  }
  return { message: 'Terjadi kesalahan. Coba lagi.', errors: {} }
}