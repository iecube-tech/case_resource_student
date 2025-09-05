import { defineStore } from "pinia";
import type { set } from "video.js/dist/types/tech/middleware";

export const useEmdV4Store = defineStore("emdV4Store", {
    state: () => {
        return {
            project: {
                id: "",
                useGroup: false,
                groupLimit: 0,
            },
            taskId: "",
            taskName: "",
            
            taskStatus: 0, // 任务状态
            currentStage: 0, // 当前任务进行到第几步骤
            currentChid: 0, // 当前步骤进行到第几块
            
            // 打开和关闭设备弹框  获取设备数据必备参数
            deviceOpen: <Function>null,
            deviceClose: <Function>null,
            currentComponentIndex: null, // 当前选中的组件索引
            cuurentCellId: null, // 当前选中的cellId
        };
    },
    getters: {
        // doubleCount: (state) => state.count * 2,
    },
    actions: {
        setProject(projectDetail) {
            this.project = projectDetail;
        },
        setTaskId(taskId) {
            this.taskId = taskId;
        },
        setTaskName(taskName) {
            this.taskName = taskName;
        },
        setDeviceOpen(func) {
            this.deviceOpen = func;
        },
        setDeviceClose(func) {
            this.deviceClose = func;
        },
        setCurrentComponentIndex(index) {
            this.currentComponentIndex = index;
        },
        setCurrentCellId(cellId) {
            this.currentCellId = cellId;
        },
        
        // 设置步骤
        setCurrentStage(stage) {
            this.currentStage = stage;
            this.currentChid = 0
        },
        setCurrentChild(currentChild) {
            this.currentChild = currentChild;
        },
        // 设置任务状态
        setTaskStatus(status) {
            this.taskStatus = status;
        },
    },
});
