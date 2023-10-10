import httpInstance from "@/utils/http";

export function getAccount() {
    return httpInstance({
        url: 'student/my',
        method: 'GET',
    })
}