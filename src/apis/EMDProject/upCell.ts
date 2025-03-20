import httpInstance from "@/utils/http";

export function UpCell(emdstsBlock: any, task: number, cellId: string) {
    return httpInstance({
        url: '/emd_task/up/cell/' + task + '/' + cellId,
        method: 'POST',
        data: emdstsBlock
    })
}