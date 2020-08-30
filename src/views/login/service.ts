import request, { LoadingCallback } from '@/api/request'

export interface UserParamsType {
  userName: string
  password: string
}

export interface LoginParamsType {
  loadingCb: LoadingCallback
  data: UserParamsType
}

export function login({
  loadingCb,
  data
}: LoginParamsType) {
  return request({
    method: 'post',
    url: '/user/login',
    data,
    loadingCb
  })
}
