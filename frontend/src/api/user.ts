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
  email?: string
  captcha?: string
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  return request.patch('/user/update-password', payload)
}

// 忘记密码
export interface ForgotPasswordPayload {
  username: string
  oldPassword: string
  newPassword: string
  email: string
  captcha: string
}

export async function requestForgotPasswordCaptcha(email: string) {
  return request.get('/user/forgot-password-captcha', { params: { email } })
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return request.patch('/user/forgot-password', payload)
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

// 更新用户信息
export interface UpdateUserInfoPayload {
  headPic?: string
  nickName?: string
  phoneNumber?: string
}

export async function requestUpdateUserCaptcha(email: string) {
  return request.get('/user/update-user-captcha', { params: { email } })
}

export async function updateUserInfo(payload: UpdateUserInfoPayload) {
  return request.patch('/user/update', payload)
}
