export interface AjaxResult<T = any> {
  code: number
  success: boolean
  msg?: string
  data?: T
}

export interface PageData<T> {
  current: number
  data: T[]
  page: number
  pageSize: number
  pages: number
  total: number
  totalRecord: number
}

export interface PageDataResult<T> extends AjaxResult<PageData<T>> {
  data: PageData<T>
}

export interface PageQuery<T> {
  page: number
  pageSize: number
  params: T
}
