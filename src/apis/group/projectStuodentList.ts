import httpInstance from "@/utils/http";

export function ProjectStudnets(projectId: Number, taskId: Number) {
    return httpInstance({
        url: '/pgroup/students/' + projectId + '/' + taskId,
        method: 'GET',
    })
}