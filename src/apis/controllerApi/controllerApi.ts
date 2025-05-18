import axios from 'axios'

const httpInstance = axios.create({
    // baseURL: '/2830-api',
    timeout: 10000
})

export const checkGrpcServer = (data: any)  =>{
    return httpInstance({
        url: '/check_grpc_server',
        method: 'get',
        params: data
    })
}

export const executeProgram = (data: any) =>{
    return httpInstance({
        url: '/execute_program',
        method: 'post',
        data: data
    })
}

export const stopProgram = (programId: string) =>{
    return httpInstance({
        url: `/stop_program/${programId}`,
        method: 'post',
    })
}