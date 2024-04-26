import httpInstance from "@/utils/http";

export function MyGroup(projectId: number, studentId: number) {
    return httpInstance({
        url: 'pgroup/group/' + projectId + "/" + studentId,
        method: 'GET',
    })
}