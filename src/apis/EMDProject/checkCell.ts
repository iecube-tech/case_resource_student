import httpInstance from "@/utils/http";

export function CheckCell(Check: any) {
    return httpInstance({
        url: '/emd_task/check',
        method: 'POST',
        data: Check
    })
}