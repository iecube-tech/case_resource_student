import httpInstance from "@/utils/http";

export function getQuestion(pstId: number) {
    return httpInstance({
        url: 'qb/sq',
        method: 'GET',
        params: { pstId: pstId }
    })
}