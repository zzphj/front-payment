/// <reference types="vite/client" />
declare module 'js-cookie' {
    interface CookiesStatic {
        get(name: string): string | undefined
        set(name: string, value: string): string | undefined
        remove(name: string): void
    }

    const Cookies: CookiesStatic
    export default Cookies
}