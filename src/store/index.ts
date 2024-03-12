import router from "@/router";
import { defineStore } from "pinia";
import { computed, ref } from 'vue'

export interface user {
    id: number
    email: string
    studentId: string
    studentName: string
    studentGrade: string
    studentClass: string
    major: string
    collage: string
}

export const useUserStore = defineStore('userState', () => {
    interface userInfo {
        user: user | null
        startTime: number | null
        expires: number | null
    }
    const userInfo = ref<userInfo>({
        user: null,
        startTime: null,
        expires: null,
    })

    const setUser = (user: user) => {
        userInfo.value.user = user
        userInfo.value.startTime = new Date().getTime()
        userInfo.value.expires = 86400000
        localStorage.setItem("userInfo", JSON.stringify(userInfo.value))
    }

    const getUser = () => {
        if (localStorage.getItem("userInfo")) {
            let item = <userInfo>JSON.parse(<string>localStorage.getItem("userInfo"))
            let date = new Date().getTime()
            if ((date - item.startTime!) > item.expires!) {
                localStorage.removeItem("userInfo")
                //login
                router.push('/login')
            } else {
                return item.user
            }
        }
        else {
            // login
            router.push('/login')
        }


    }
    const clearUser = () => {
        localStorage.removeItem("userInfo")
    }

    return {
        setUser,
        getUser,
        clearUser
    }
});