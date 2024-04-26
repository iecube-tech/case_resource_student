import httpInstance from "@/utils/http";

export function JoinGroup(code: any, projectId: number) {
    return httpInstance({
        url: 'pgroup/join/' + projectId,
        method: 'POST',
        params: { code: code }
    })
}