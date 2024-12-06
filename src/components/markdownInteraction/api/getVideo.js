import httpInstance from "@/utils/http";
export function GetVideo(filename) {
    return httpInstance({
        url: '/video/n/' + filename,
        method: 'GET',
    })
}