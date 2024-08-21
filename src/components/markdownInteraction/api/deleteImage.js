import httpInstance from "@/utils/http.ts";
export function DeleteImage(filename) {
    return httpInstance({
        url: '/files//del/' + filename,
        method: 'DELETE',
    })
}