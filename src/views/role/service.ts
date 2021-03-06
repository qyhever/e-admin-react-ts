import axios, { Canceler } from 'axios'
import request from '@/api/request'
import {
  QueryRoleListFormData,
  QueryRoleListResult,
  SaveRoleFormData
} from './types'

export function getRoles(params: QueryRoleListFormData): Promise<QueryRoleListResult> {
  return request({
    method: 'get',
    url: '/role',
    params
  })
}

export const saveRole = (
  data: SaveRoleFormData,
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
