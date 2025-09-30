import request from '@/utils/request'

export interface RegisterPayload {
  username: string
  password: string
  nickName: string
  email: string
  captcha: string
}

export async function requestRegisterCaptcha(email: string) {
  return request.get('/user/register-captcha', { params: { email } })
}

export async function register(payload: RegisterPayload) {
  return request.post('/user/register', payload)
}

// 预留：登录接口（后端未提供时不调用）
export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userInfo: unknown
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // 通过响应拦截已返回 data，这里显式断言返回业务数据类型
  return request.post<LoginResponse>('/user/login', payload) as unknown as Promise<LoginResponse>
}

// 修改密码相关
export interface UpdatePasswordPayload {
  oldPassword: string
  newPassword: string
  email: string
  captcha: string
}

export async function requestUpdatePasswordCaptcha(email: string) {
  return request.get('/user/update-password-captcha', { params: { email } })
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  return request.patch('/user/update-password', payload)
}

// 用户信息
export interface UserInfoResponse {
  id: number
  username: string
  nickName: string
  email: string
  headPic?: string
  phoneNumber?: string
  isFrozen: boolean
  isAdmin: boolean
  createTime: string
  roles: string[]
  permissions: string[]
}

export async function getUserInfo() {
  return request.get<UserInfoResponse>('/user/info') as unknown as Promise<UserInfoResponse>
}
