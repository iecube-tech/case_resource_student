
import httpInstance from "@/utils/http";

export function ReFreshGroupCode(groupId: number) {
    return httpInstance({
        url: '/pgroup/group/code/refresh',
        method: 'GET',
        params: { groupId: groupId }
    })
}