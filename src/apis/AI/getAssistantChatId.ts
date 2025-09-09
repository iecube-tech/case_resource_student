import httpInstance from "@/utils/http";

export function GetAssistantChatId(taskId: number, version: number) {
    return httpInstance({
        url: '/ai/assistant/chat',
        method: 'POST',
        params: { taskId: taskId, version: version }
    })
}