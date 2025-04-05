import httpInstance from "@/utils/http";

export function UpdateModelStatus(modelId: number, currAskNum: number, status: number) {
    return httpInstance({
        url: '/emd_task/model/update',
        method: 'POST',
        params: { modelId: modelId, currAskNum: currAskNum, status: status }
    })
}