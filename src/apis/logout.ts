import httpInstance from "@/utils/http";
export function Logout() {
    return httpInstance({
        url: '/teacher/logout',
        method: 'GET'
    })
}