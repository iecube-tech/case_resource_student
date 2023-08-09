import httpInstance from "@/utils/http";

export function MyProject() {
    return httpInstance({
        url: 'project/myproject',
        method: 'GET',
    })
}