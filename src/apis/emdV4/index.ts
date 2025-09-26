import httpInstance from "@/utils/http";
import { id } from "element-plus/es/locale/index.mjs";

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

export function updateEmdV4BlockScore(id, score){
    return httpInstance({
        url: `/emdv4/block/up/score/${id}`,
        method: "POST",
        params: {score}
    })
}

interface UpdateBlockTimeParams {
  id: string; // Use lowercase 'string' for primitive type
  startTime: boolean; // Use lowercase 'boolean' for primitive type
  endTime: boolean; // Use lowercase 'boolean' for primitive type
}

// 目前只有实验预习时调用，其他步骤通过修改comp payload 自动更新
export function updateEmdV4BlockTime({id, startTime, endTime}: UpdateBlockTimeParams) {
    return httpInstance({
        url: `/emdv4/block/up/time`,
        method: "POST",
        data: { id, startTime, endTime }
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



// 学生分组相关接口

/**
 * 学生查询自己的分组情况
 * @param taskId EMDV4ProjectTask 的 id 字段
 */
export function getEmdV4MyGroup(taskId) {
    return httpInstance({
        url: "/emdv4/task/group/my_group",
        method: "GET",
        params: { taskId }
    });
}

/**
 * 学生创建小组
 * @param taskGroupQo 小组信息对象
 * - id: null
 * - taskId: 不为null
 * - name: 不为null
 * - students: null
 */
export function createEmdV4Group(taskGroupQo) {
    return httpInstance({
        url: "/emdv4/task/group/create",
        method: "POST",
        data: taskGroupQo
    });
}

/**
 * 分组完成
 * 分组完成后，不支持小组及小组成员变更
 * @param id EMDV4TaskGroup 的id字段
 */
export function finishEmdV4Group(id) {
    return httpInstance({
        url: "/emdv4/task/group/done",
        method: "POST",
        params: { id }
    });
}

/**
 * 学生删除自己创建的小组
 * @param id EMDV4TaskGroup 的id字段
 */
export function deleteEmdV4Group(id) {
    return httpInstance({
        url: "/emdv4/task/group/del",
        method: "DELETE",
        params: { id }
    });
}

/**
 * 学生查询实验内未加入小组的学生名单
 * @param taskId EMDV4ProjectTask 的 id 字段
 */
export function getEmdV4NotJoinedStudents(taskId) {
    return httpInstance({
        url: "/emdv4/task/group/has_not_joined",
        method: "GET",
        params: { taskId }
    });
}

/**
 * 组长向自己的小组添加组员
 * @param taskGroupQo 小组信息对象
 * - id: 不为null (EMDV4TaskGroup 的id字段)
 * - taskId: null
 * - name: null
 * - students: 不为null (完整的Student对象的列表)
 */
export function addEmdV4GroupStudents(taskGroupQo) {
    return httpInstance({
        url: "/emdv4/task/group/add_stu",
        method: "POST",
        data:  taskGroupQo 
    });
}

/**
 * 组长移除小组成员
 * @param id EMDV4TaskGroup 的id字段
 * @param studentId Student的id字段
 */
export function removeEmdV4GroupStudent(id, studentId) {
    return httpInstance({
        url: "/emdv4/task/group/remove_stu",
        method: "POST",
        params: { id, studentId }
    });
}

// 刷新邀请码
export function refreshEmdV4GroupCode(id) {
    return httpInstance({
        url: "/emdv4/task/group/code_fresh",
        method: "POST",
        params: { id }
    });
}

// 申请加入组
export function applyJoinGroup(taskId, code){
     return httpInstance({
        url: "/emdv4/task/group/join",
        method: "POST",
        params: { taskId, code }
    });
}


// 实验中上传图片
export function uploadImg(formData) {
    return httpInstance({
        url: "/files/e/image",
        method: "POST",
        data: formData
    });

}


