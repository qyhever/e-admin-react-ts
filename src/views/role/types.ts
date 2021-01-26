export type QueryRoleListFormData = BasicTableParams & {
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

export type SaveRoleFormData = {
  id?: number
  name: string
  description: string
  resources: number[]
}
