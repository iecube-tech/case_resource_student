import httpInstance from "@/utils/http";

export function UpdateGroupName(groupId: number, groupName: string) {
    return httpInstance({
        url: 'pgroup/uname',
        method: 'POST',
        params: { groupId: groupId, groupName: groupName }
    })
}