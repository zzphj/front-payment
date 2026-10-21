/** 商户回调状态 */
export const CallbackStatus = {
  Processing: 'PROCESSING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
} as const

export type CallbackStatus = (typeof CallbackStatus)[keyof typeof CallbackStatus]
