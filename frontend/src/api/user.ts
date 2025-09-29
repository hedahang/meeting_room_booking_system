import axios from 'axios'

export interface RegisterPayload {
  username: string
  password: string
  nickName: string
  email: string
  captcha: string
}

export async function requestRegisterCaptcha(email: string) {
  return axios.get('/user/register-captcha', { params: { email } })
}

export async function register(payload: RegisterPayload) {
  return axios.post('/user/register', payload)
}

// 预留：登录接口（后端未提供时不调用）
export interface LoginPayload {
  username: string
  password: string
}

export async function login(payload: LoginPayload) {
  return axios.post('/user/login', payload)
}



