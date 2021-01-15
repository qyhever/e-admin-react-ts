export type ResourceCategory = '1' | '2'

export type ResourceItem = {
  code: string
  createdAt: string
  enable: boolean
  id: number
  name: string
  parentCode: string | null
  type: ResourceCategory
  updatedAt: string
  children?: ResourceItem[]
}

export type QueryResourceListFormData = BasicTableParams & {
  name?: string
  code?: string
  type?: ResourceCategory
}

export type SaveResourceFormData = {
  id?: number
  name: string
  code: string
  type: ResourceCategory
  parentCode: string | null
}

export type PatchResourceFormData = {
  id: number
  enable: boolean
}

export type QueryResourceListResult = QueryListResult<ResourceItem>

export type QueryDirsResult = {
  id: number
  code: string | null
  name: string
}
