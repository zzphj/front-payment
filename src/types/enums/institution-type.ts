/** 机构类型 */
export const InstitutionType = {
  Gateway: 'GATEWAY',
  Merchant: 'MERCHANT',
} as const

export type InstitutionType = (typeof InstitutionType)[keyof typeof InstitutionType]
