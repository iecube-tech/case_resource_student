import httpInstance from "@/utils/http";

export const uploadPdf = (data) => {
    return httpInstance({
        url: '/task/submitfile',
        method: 'POST',
        data
    })
}