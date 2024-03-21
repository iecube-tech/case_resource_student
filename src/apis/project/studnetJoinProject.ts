import httpInstance from "@/utils/http";

export function JoinProject(projectId: Number) {
    return httpInstance({
        url: 'project/join_project/' + projectId,
        method: 'POST',
    })
}