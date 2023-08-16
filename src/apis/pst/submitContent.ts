import httpInstance from "@/utils/http";

export function submitContent(content: String, pstId: number) {
    return httpInstance({
        url: 'task/submitcontent',
        method: 'post',
        params: { content: content, pstId: pstId }
    })
}