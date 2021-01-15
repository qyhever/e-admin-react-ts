export type QueryUserListFormData = BasicTableParams & {
  userName?: string
  fullName?: string
  enable?: 0 | 1
}

export type UserListItem = {
  id: number
  avatar: string
  enable: boolean
  fullName: string
  userName: string
  roles: {
    id: number
    name: string
  }[]
  createdAt: string
  updatedAt: string
}

export type QueryUserListResult = {
  total: number
  list: UserListItem[]
}

export type SaveUserFormData = {
  id?: number
  avatar: string
  enable: boolean
  fullName: string
  userName: string
  roles: number[]
}

export type PatchUserFormData = {
  id: number
  enable: boolean
}
