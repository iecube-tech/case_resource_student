//axios 封装
import axios from 'axios'
import router from '@/router';

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
    timeout: 5000
})

//拦截器
//请求拦截器
httpInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))
//响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    if (e.response.status == 302) {
        router.push('/login')
    }
    return Promise.reject(e)
})


export default httpInstance