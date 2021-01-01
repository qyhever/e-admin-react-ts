declare global {
  interface BasicTableParams {
    page?: number
    size?: number
    sortProp?: string
    sortOrder?: 1 | -1
  }

  interface QueryListResult<T = any> {
    total: number
    list: T[]
  }
}

export {}