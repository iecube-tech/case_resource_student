import httpInstance from "@/utils/http";

export function sAnswer(submitQoList: Array<any>, pstId: number) {
    return httpInstance({
        url: 'qb/submit',
        method: 'POST',
        params: { pstId: pstId },
        data: submitQoList
    })
}