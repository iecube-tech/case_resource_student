import request from "./anyHttp";

export const aiCheckAnswer = (data) => {
    return request({
        url: '/aicheck/online/3835/answer',
        method: 'post',
        data,
        timeout: 0,
    })
}