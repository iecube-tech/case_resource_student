import dayjs from 'dayjs';

export const formatDate = (time: string | Date, showTime: boolean = true) => {
    if (!time) {
        return ''
    }
    if (showTime) {
        return dayjs(time).format('YYYY年MM月DD日 HH:mm')
    } else {
        return dayjs(time).format('YYYY年MM月DD日')
    }

}

export function base64DecodeUnicode(str: string) {
    // 首先使用 atob() 进行基本的 Base64 解码
    return decodeURIComponent(escape(atob(str)));
}