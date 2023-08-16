import httpInstance from "@/utils/http";

export function deleteSubmitFile(PSTResourceId: number) {
    return httpInstance({
        url: 'task/deletesubmitfile',
        method: 'GET',
        params: { PSTResourceId: PSTResourceId }
    })
}