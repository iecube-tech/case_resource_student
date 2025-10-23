import httpInstance from "@/utils/http";
// 本地服务器控制相关api
//ai 助理相关api
export const getControllerAiChartId = (taskId: string, version: number) => {
    return httpInstance({
        url: '/aiofcontrol/2830/chat',
        method: 'get',
        params: {
            taskId: taskId,
            version: version
        }
    })
}