import httpInstance from "@/utils/http";
export function GetVideo(filename: string) {
    return httpInstance({
        url: '/video/n/' + filename,
        method: 'GET',
    })
}