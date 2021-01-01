import axios, { Canceler } from 'axios'
import request from '@/api/request'
import { ResourceItemType } from '@/api/global'

export type ResourceCategory = '1' | '2'

export type GetResourcesParams = BasicTableParams & {
  name?: string
  code?: string
  type?: ResourceCategory
}

export type SaveResourceParams = {
  id?: number
  name: string
  code: string
  type: ResourceCategory
  parentCode: string | null
}

export type PatchResourceParams = {
  id: number
  enable: boolean
}

export type QueryResourceListResult = QueryListResult<ResourceItemType>

export type QueryDirsResult = {
  id: number
  code: string | null
  name: string
}

export const getResources = (params: GetResourcesParams): Promise<QueryResourceListResult> => {
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
  params: SaveResourceParams,
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
  params: PatchResourceParams,
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
