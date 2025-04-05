//axios 封装
import axios from 'axios'
import router from '@/router';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true

declare module "axios" {
    interface AxiosResponse<T = any> {
        state: null;
        message: '';
    }
    export function create(config?: AxiosRequestConfig): AxiosInstance;
}

const httpInstance = axios.create({
    baseURL: '/dev-api',
    timeout: 10000
})

//拦截器
//请求拦截器
httpInstance.interceptors.request.use(config => {
    config.headers["x-access-type"] = "student"
    config.headers["x-access-token"] = localStorage.getItem("x-access-token")
    return config
}, e => Promise.reject(e))
//响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    if (e.response.status == 403) {
        localStorage.removeItem("x-access-token")
        localStorage.removeItem("x-access-type")
        localStorage.removeItem("userInfo")
        ElMessage.error("请登录")
        router.push('/login')
        return
    }
    if (e.response.status == 401) {
        ElMessage.error("请重新登录")
        localStorage.removeItem("x-access-token")
        localStorage.removeItem("x-access-type")
        localStorage.removeItem("userInfo")
        router.push('/login')
        return
    }
    if (e.response.status != 200) {
        ElMessage.error("请求错误/服务异常")
        return
    }

    return Promise.reject(e)
})


export default httpInstance