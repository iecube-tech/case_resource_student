import httpInstance from "@/utils/http";

export function MyGroup(taskId: number, studentId: number) {
    return httpInstance({
        url: 'pgroup/group/' + taskId + "/" + studentId,
        method: 'GET',
    })
}