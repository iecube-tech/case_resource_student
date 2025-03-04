import httpInstance from "@/utils/http";

export function GetEMDTaskDetailVo(taskId: number) {
    return httpInstance({
        url: '/emd_task/task',
        method: 'GET',
        params: { taskId: taskId }
    })
}