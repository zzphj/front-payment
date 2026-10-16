export interface AjaxResult<T = any> {
  code: number
  success: boolean
  msg?: string
  data?: T
}

/** 分页业务 data，对应 AjaxResult.data */
export interface PageDataResult<T> {
  current: number
  data: T[]
  page: number
  pageSize: number
  pages: number
  total: number
  totalRecord: number
}

export interface PageQuery<T> {
  page: number
  pageSize: number
  params: T
}
