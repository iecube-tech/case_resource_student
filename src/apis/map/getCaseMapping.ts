import httpInstance from "@/utils/http";

export function GetCaseMapping(caseId: number) {
    return httpInstance({
        url: '/map/mapping/' + caseId,
        method: 'GET',
    })
}