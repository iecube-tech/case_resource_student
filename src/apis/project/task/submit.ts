import httpInstance from "@/utils/http";
export function PSTSubmite(pstId: any) {
    return httpInstance({
        url: '/task/submit',
        method: 'POST',
        params: { pstId: pstId }
    })
}