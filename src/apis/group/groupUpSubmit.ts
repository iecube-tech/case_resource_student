import httpInstance from "@/utils/http";

export function GroupUpdateSubmitted(groupId: number, submitted: number) {
    return httpInstance({
        url: 'pgroup/submitted/' + groupId,
        method: 'POST',
        params: { submitted: submitted }
    })
}