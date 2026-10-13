import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken(): string | undefined {
  // console.log("get token:" + Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token: string): string | undefined {
  // console.log("set token:" + token)
  return Cookies.set(TokenKey, token)
}

export function removeToken(): void {
  Cookies.remove(TokenKey)
}
