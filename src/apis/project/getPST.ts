import httpInstance from "@/utils/http";

export function PST(projectId: number) {
    return httpInstance({
        url: 'task',
        method: 'GET',
        params: { projectId: projectId }
    })
}