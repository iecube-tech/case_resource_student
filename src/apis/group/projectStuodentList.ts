import httpInstance from "@/utils/http";

export function ProjectStudnets(projectId: Number) {
    return httpInstance({
        url: '/pgroup/students/' + projectId,
        method: 'GET',
    })
}