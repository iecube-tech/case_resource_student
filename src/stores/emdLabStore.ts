import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmdStore = defineStore('emdLab', {
    state: () => ({
        taskId: ref(),
        deviceDataDialog: ref(true),
        hasNewVal: ref(false),
        selectedValue: ref()
    }),
    actions: {
        setTaskId(taskId: any) {
            this.taskId = taskId;
        },
        setDeviceDataDialog() {
            this.deviceDataDialog = !this.deviceDataDialog
        },
        setHasNewVal(has: boolean) {
            this.hasNewVal = has
        },
        setSelectedValue(val: string | number) {
            this.selectedValue = val
        }

    },
    getters: {
        getTaskId: (state) => state.taskId,
        getSelectedValue: (state) => state.selectedValue,
    }
});