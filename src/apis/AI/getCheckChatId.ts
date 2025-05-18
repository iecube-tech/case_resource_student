import httpInstance from "@/utils/http";

export function GetChecktChatId(taskId: number) {
    return httpInstance({
        url: '/ai/check/chat',
        method: 'POST',
        params: { taskId: taskId }
    })
}