import httpInstance from "@/utils/http";

export function SubmitHtml(htmlValue: object) {
    return httpInstance({
        url: 'pst_ddd/test',
        method: 'POST',
        data: htmlValue
    })
}   