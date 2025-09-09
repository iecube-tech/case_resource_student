import httpInstance from "@/utils/http";

export function GetChecktChatId(taskId: number, version: number) {
    return httpInstance({
        url: '/ai/check/chat',
        method: 'POST',
        params: { taskId: taskId, version: version }
    })
}