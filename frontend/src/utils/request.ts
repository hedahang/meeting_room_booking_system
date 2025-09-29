import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios'

// 基础配置：走 Vite 代理（见 vite.config.ts -> server.proxy），因此 baseURL 留空或 '/' 即可
const BASE_URL = '/'

// 从本地存储获取 token（如后续切到 Pinia，可在此替换实现）
function getToken(): string | null {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

// 创建实例
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: false,
})

// 请求拦截：统一附加 Authorization
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      const headers = config.headers as AxiosHeaders | (Record<string, any> | undefined)
      if (headers && typeof (headers as AxiosHeaders).set === 'function') {
        ;(headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
      } else {
        config.headers = {
          ...(headers || {}),
          Authorization: `Bearer ${token}`,
        } as any
      }
    }
    return config
  },
  (error: any) => Promise.reject(error),
)

// 响应拦截：后端已通过 FormatResponseInterceptor 统一包装 { code, message, data }
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 兼容纯数据与统一包装
    const payload = response.data
    if (payload && typeof payload === 'object' && 'code' in payload && 'data' in payload) {
      const { code, message, data } = payload as { code: number; message?: string; data: unknown }
      if (code >= 200 && code < 300) return data as any
      // 非 2xx 当作错误抛出
      const error = new Error(message || '请求失败')
      ;(error as any).__isAppBusinessError = true
      ;(error as any).__response = payload
      throw error
    }
    // 非包装响应（例如文件下载）
    return payload
  },
  (error: AxiosError) => {
    // 统一错误提示信息整理
    const status = error.response?.status
    const data: any = error.response?.data
    const serverMessage = data?.message
    const message = serverMessage || error.message || '网络错误'

    // 可在此处理 401/403 等，如清理 token 或跳转登录
    if (status === 401) {
      // localStorage.removeItem('token')
      // 可根据需要跳转登录页
    }

    return Promise.reject({ status, message, raw: error })
  },
)

export default request
