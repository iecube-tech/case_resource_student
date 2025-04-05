import httpInstance from "@/utils/http";

export function UseQuestioner(agentQo: any) {
    return httpInstance({
        url: '/ai/questioner',
        method: 'POST',
        data: agentQo
    })
}