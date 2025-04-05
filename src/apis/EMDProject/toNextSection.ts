import httpInstance from "@/utils/http";

export function ToNestSection(STMSId: number) {
    return httpInstance({
        url: '/emd_task/section/next',
        method: 'POST',
        params: { STMSId: STMSId }
    })
}