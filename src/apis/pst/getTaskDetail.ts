import httpInstance from "@/utils/http";

export function taskDetail(pstId: number) {
    return httpInstance({
        url: 'task/taskdetail',
        method: 'GET',
        params: { pstId: pstId }
    })
}