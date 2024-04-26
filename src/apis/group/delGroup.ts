import httpInstance from "@/utils/http";

export function DeleteGroup(groupId: number) {
    return httpInstance({
        url: 'pgroup/del',
        method: 'POST',
        params: { groupId: groupId }
    })
}