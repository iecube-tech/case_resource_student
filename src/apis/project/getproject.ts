import httpInstance from "@/utils/http";

export function getProject(projectId: number) {
    return httpInstance({
        url: 'project/project',
        method: 'GET',
        params: { projectId: projectId }
    })
}