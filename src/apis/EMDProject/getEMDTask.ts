import httpInstance from "@/utils/http";

export function GetEMDTask(projectId: number) {
    return httpInstance({
        url: '/emd_task/tasks',
        method: 'GET',
        params: { projectId: projectId }
    })
}