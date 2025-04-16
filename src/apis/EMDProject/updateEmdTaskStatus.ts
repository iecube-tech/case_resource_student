import httpInstance from "@/utils/http";

export function UpdateTaskStatus(taskId: any, status: number) {
    return httpInstance({
        url: '/emd_task/task/status/update',
        method: 'POST',
        params: {
            taskId: taskId,
            status: status
        }
    })
}