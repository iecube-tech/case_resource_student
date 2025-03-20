import httpInstance from "@/utils/http";

export function ToNestSection(STSId: number) {
    return httpInstance({
        url: '/emd_task/section/next',
        method: 'POST',
        params: { STSId: STSId }
    })
}