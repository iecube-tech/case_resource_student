import httpInstance from "@/utils/http";

export function UseMarker(agentQo: any) {
    return httpInstance({
        url: '/ai/marker',
        method: 'POST',
        data: agentQo
    })
}