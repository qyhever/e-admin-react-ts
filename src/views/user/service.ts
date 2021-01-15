import axios, { Canceler } from 'axios'
import request from '@/api/request'
import {
  QueryUserListFormData,
  QueryUserListResult,
  SaveUserFormData,
  PatchUserFormData
} from './types'

export const getUsers = (params: QueryUserListFormData): Promise<QueryUserListResult> => {
  return request({
    method: 'get',
    url: '/user',
    params
  })
}

export const saveUser = (
  params: SaveUserFormData,
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'post',
    url: '/user',
    data: params,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}

export const patchUser = (params: PatchUserFormData) => {
  return request({
    method: 'patch',
    url: '/user',
    data: params
  })
}

export const deleteUser = (
  params: { id: number },
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'delete',
    url: `/user/${params.id}`,
    params,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}
