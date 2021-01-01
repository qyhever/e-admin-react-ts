import axios, { Canceler } from 'axios'
import request from '@/api/request'

export type GetRolesParamsType = BasicTableParams & {
  name?: string
}

export type ResourceListItem = {
  id: number
  name: string
  code: string
  parentCode: string | null
  type: '1' | '2'
}

export type RoleListItem = {
  id: number
  name: string
  description: string
  resources: ResourceListItem[]
  createdAt: string
  updatedAt: string
}

export type QueryRoleListResult = {
  total: number
  list: RoleListItem[]
}

export type SaveRoleRecord = {
  id?: number
  name: string
  description: string
  resources: string[]
}

export function getRoles(params: GetRolesParamsType): Promise<QueryRoleListResult> {
  return request({
    method: 'get',
    url: '/role',
    params
  })
}

export const saveRole = (
  data: SaveRoleRecord,
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'post',
    url: '/role',
    data,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}

export const deleteRole = (
  params: {id: number},
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'delete',
    url: `/role/${params.id}`,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}
