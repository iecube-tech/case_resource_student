import httpInstance from "@/utils/http";

// 查询课程的实验列表
export function getEmdV4Task(projectId) {
    return httpInstance({
        url: "/emdv4/project/detail/tasks",
        method: "GET",
        params: { projectId },
    });
}


// 获取实验的详细信息
export function getEmdV4TaskDetail(projectTaskId) {
    return httpInstance({
        url: "/emdv4/task/detail/task_detail",
        method: "GET",
        params: { projectTaskId },
    });
}

// block 
// 更新block的状态
export function updateEmdV4BlockStatus(id, status) {
    return httpInstance({
        url: `/emdv4/block/up/status/${id}`,
        method: "POST",
        params: {status} 
    });
}


// component
// 更新组件状态
export function updateEmdV4ComponentStatus(id, status) {
    return httpInstance({
        url: `/emdv4/component/up/status/${id}`,
        method: "POST",
        params: { status }
    });
}

// 更新组件payload
export function updateEmdV4ComponentPayload(id, payload) {
    return httpInstance({
        url: `/emdv4/component/up/payload/${id}`,
        method: "POST",
        data: { payload:payload }
    });
}

// 更新组件分数
export function updateEmdV4ComponentScore(id, score) {
    return httpInstance({
        url: `/emdv4/component/up/score/${id}`,
        method: "POST",
        params: { score }
    });
}

// 获取Projec的详细信息
export function projectDetail(id) {
    return httpInstance({
        url: `/emdv4/project/detail`,
        method: "GET",
        params: { id }
    });
}
