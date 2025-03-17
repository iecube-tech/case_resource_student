import httpInstance from "@/utils/http";

export function GetTaskRef(taskId: number) {
    return httpInstance({
        url: '/emd_task/ref',
        method: 'GET',
        params: { taskId: taskId }
    })
}