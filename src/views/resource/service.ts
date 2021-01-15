import axios, { Canceler } from 'axios'
import request from '@/api/request'
import {
  QueryResourceListFormData,
  QueryResourceListResult,
  QueryDirsResult,
  SaveResourceFormData,
  PatchResourceFormData
} from './types'

export const getResources = (params: QueryResourceListFormData): Promise<QueryResourceListResult> => {
  return request({
    method: 'get',
    url: '/resource',
    params
  })
}

export const getDirs = (): Promise<QueryDirsResult[]> => {
  return request({
    method: 'get',
    url: '/resource/dir'
  })
}

export const saveResource = (
  params: SaveResourceFormData,
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'post',
    url: '/resource',
    data: params,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}

export const patchResource = (
  params: PatchResourceFormData,
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'patch',
    url: '/resource',
    data: params,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}

export const deleteResource = (
  params: { id: number },
  cancelCallback: (cancel: Canceler) => void = () => {} // eslint-disable-line
) => {
  return request({
    method: 'delete',
    url: `/resource/${params.id}`,
    params,
    cancelToken: new axios.CancelToken(cancelCallback)
  })
}
