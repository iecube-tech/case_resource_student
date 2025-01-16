import httpInstance from "@/utils/http";
export function GetCaseVideo(caseId: any) {
    return httpInstance({
        url: '/video/n/list/' + caseId,
        method: 'GET',
    })
}