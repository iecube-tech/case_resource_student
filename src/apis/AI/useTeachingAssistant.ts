import httpInstance from "@/utils/http";

export function UseTeachingAssistant(agentQo: any) {
    return httpInstance({
        url: '/ai/teaching_assistant',
        method: 'POST',
        data: agentQo
    })
}