import httpInstance from "@/utils/http";
export function updatePSTDataTables(data:any) {
    return httpInstance({
        url: '/task/up_dt',
        method: 'POST',
        data: data,
    })
}