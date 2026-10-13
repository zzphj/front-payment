export interface AjaxResult<T = any> {
  code: number
  success: boolean
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


/** 分页参数类型 */
export interface PageDomain {
  /** 当前记录起始索引 */
  page?: number
  /** 每页显示记录数 */
  pageSize?: number
}

/** Entity基类 */
export interface BaseEntity {
  /** 搜索值 */
  searchValue?: string
  /** 创建者 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新者 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
  /** 请求参数 */
  params?: Record<string, any>
}

/** Treeselect树结构类型 */
export interface TreeSelect {
  /** 节点ID */
  id?: number
  /** 节点名称 */
  label?: string
  /** 节点禁用 */
  disabled: boolean
  /** 子节点 */
  children: TreeSelect[]
}

/** 显隐列信息 */
export interface TableShowColumns {
  // 显示名称
  label: string
  // 是否显示
  visible: boolean
}

/** 文件上传响应数据 */
export interface UploadFileResult extends AjaxResult {
  /** 文件名称（包含路径） */
  fileName: string
  /** 文件名称（不含路径） */
  newFileName: string
  /** 完整URL地址 */
  url: string
  /** 原始文件名称 */
  originalFilename: string
}
