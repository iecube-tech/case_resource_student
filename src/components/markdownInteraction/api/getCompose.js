import httpInstance from "@/utils/http.ts";
const CHARACTERS = import.meta.env.VITE_APP_CHARACTERS
export function GetComposeData(articleId, index) {
    let url = ''
    if (CHARACTERS === 'T') {
        url = '/t/article/compose/' + articleId + '/' + index
    }
    if (CHARACTERS === 'S') {
        url = '/s/article/compose/' + articleId + '/' + index
    }
    return httpInstance({
        url: url,
        method: 'GET',
    })
}