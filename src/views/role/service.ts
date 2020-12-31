import request from '@/api/request'

type GetRolesParamsType = {
  page?: number
  size?: number
  sortProp?: string
  sortOrder?: 1 | -1
  name?: string
}

export function getRoles(params: GetRolesParamsType) {
  return request({
    method: 'get',
    url: '/role',
    params
  })
}
