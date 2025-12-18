import httpInstance from "@/utils/http";

export function MyGrade() {
    return httpInstance({
        url: 'project/mygrade',
        method: 'GET',
    })
}