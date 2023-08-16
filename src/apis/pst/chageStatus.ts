import httpInstance from "@/utils/http";

export function changeStatus(pstId: number) {
    return httpInstance({
        url: 'task/changestatus',
        method: 'get',
        params: { pstId: pstId }
    })
}