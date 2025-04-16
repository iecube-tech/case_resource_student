import httpInstance from "@/utils/http";

export function GetTask(id: number) {
    return httpInstance({
        url: '/task/task/' + id,
        method: 'GET',
    })
}