import { getInfo, login, logOut } from "@/api/login"
import { getToken } from "@/utils/auth"
import { defineStore } from "pinia"


// 定义对象的结构，有没有它其实都不响应代码的运行，定义它只是能够更加清晰的知道这个对象的属性，以便更好的使用
interface UserState {
    isBindPhone: boolean
    memberId: number
    resources: string[]
    token: string | undefined
}

const useUserStore = defineStore(
    'user',
    {
        state: (): UserState => ({
            token: getToken(),
            memberId: 0,
            resources: [],
            isBindPhone: false,
        }),
        actions: {
            login(userinfo: { username: string, password: string, googleCode: string }) {
                return new Promise<void>((resolve, reject) => {
                    login(userinfo.username, userinfo.password, userinfo.googleCode).then(res => {
                        this.token = res.token
                        this.memberId = res.memberId
                        this.resources = res.resources
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            getInfo() {
                return new Promise<void>((resolve, reject) => {
                    getInfo().then(res => {
                        this.memberId = res.memberId
                        this.resources = res.permissions
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            logOut() {
                return new Promise<void>((resolve, reject) => {
                    logOut().then(res => {
                        this.token = ''
                        this.memberId = 0
                        this.resources = []
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
        }
    }
)

export default useUserStore