import httpInstance from "@/utils/http";

export function CreateGroup(group: any) {
    return httpInstance({
        url: 'pgroup/n',
        method: 'POST',
        data: group
    })
}