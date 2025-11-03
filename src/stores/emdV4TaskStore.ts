import { defineStore } from "pinia";

export const useEmdV4Store = defineStore("emdV4Store", {
    state: () => {
        return {
            project: {
                id: "",
                useGroup: false,
                groupLimit: 0,
            },
            taskId: ref(),
            taskName: "",

            taskStatus: 0, // 任务状态
            currentStage: 0, // 当前任务进行到第几步骤
            currentChild: 0, // 当前步骤进行到第几块

            // 打开和关闭设备弹框  获取设备数据必备参数
            deviceOpen: <Function | null>null,
            deviceClose: <Function | null>null,
            currentComponentIndex: null, // 当前选中的组件索引
            currentCellId: null, // 当前选中的cellId

            // 缓存实验指导书第一层block状态
            taskBook: {
                children: <any[]>[],
            },
            // 设置组件映射的根节点
            componentMapping: [],

            deviceContect: false, // 设备

            currentStepAssistParams: {
                checked: false,  // 步骤指导书参数 需要校验得分的辅助参数
            },
        };
    },
    getters: {
        getCurrentStepChecked(state) {
            return state.currentStepAssistParams.checked;
        },
        getTaskId: (state) => state.taskId,
        getTaskName: (state) => state.taskName,
    },
    actions: {
        setProject(projectDetail: any) {
            this.project = projectDetail;
        },
        setTaskId(taskId: any) {
            this.taskId = taskId;
        },
        setTaskName(taskName: any) {
            this.taskName = taskName;
        },
        setDeviceOpen(func: any) {
            this.deviceOpen = func;
        },
        setDeviceClose(func: any) {
            this.deviceClose = func;
        },
        setCurrentComponentIndex(index: any) {
            this.currentComponentIndex = index;
        },
        setCurrentCellId(cellId: any) {
            this.currentCellId = cellId;
        },

        // 设置步骤
        setCurrentStage(stage: any) {
            this.currentStage = stage;
            this.currentChild = 0
        },
        setCurrentChild(currentChild: any) {
            this.currentChild = currentChild;
        },
        // 设置任务状态
        setTaskStatus(status: any) {
            this.taskStatus = status;
        },

        setTaskBookChildren(taskBookChildren: any) {
            this.taskBook.children = taskBookChildren
        },
        setComponentMapping(mapping: any) {
            this.componentMapping = mapping;
        },
        // 获取comp 对应 root block 对应节点 status
        getBlockStatusByComponentId(id: any) {
            let blockIndex = this.componentMapping[id];
            if (blockIndex == undefined) {
                return 0
            } else {
                return this.taskBook.children[blockIndex].status;
            }
        },
        // 获取comp 对应 root block
        getRootBlockByComponentId(id: any) {
            let block = undefined
            let blockIndex = this.componentMapping[id];
            block = this.taskBook.children[blockIndex]
            return block;
        },
        setDeviceContect(link: any) {
            this.deviceContect = link
        },

        setCurrentStepAssistParamsChecked(checked: any) {
            this.currentStepAssistParams.checked = checked
        },

    },
});
