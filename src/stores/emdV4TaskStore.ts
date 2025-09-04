import { defineStore } from "pinia";
import type { set } from "video.js/dist/types/tech/middleware";

export const useDeviceStore = defineStore("deviceStore", {
    state: () => {
        return {
            project: {
                id: "",
                useGroup: false,
                groupLimit: 0,
            },
            taskId: "",
            taskName: "",
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
    },
});
