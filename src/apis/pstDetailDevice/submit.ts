import httpInstance from "@/utils/http";

export function Submit(pstId: number) {
    return httpInstance({
        url: 'pst_ddd/submit',
        method: 'GET',
        params: { pstId: pstId }
    })
}   