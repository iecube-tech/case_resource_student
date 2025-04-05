import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmdStore = defineStore('emdLab', {
    state: () => ({
        taskId: ref(),
        taskName: ref(),
        deviceDataDialog: ref(true),
        hasNewVal: ref(false),
        selectedValue: ref(),
        labModelList: ref(),
        isScrolling: ref(false),
        showZoomed: ref(false),// 放大图片
        imageSrc: ref(''),  // 放大图片
        currModel: ref(), // 当前进行的model
        canNextModel: false, // 学生回答完问题 可以进入下一个model
    }),
    actions: {
        setTaskId(taskId: any) {
            this.taskId = taskId;
        },
        setTaskName(taskName: any) {
            this.taskName = taskName
        },
        setDeviceDataDialog() {
            this.deviceDataDialog = !this.deviceDataDialog
        },
        setHasNewVal(has: boolean) {
            this.hasNewVal = has
        },
        setSelectedValue(val: string | number) {
            this.selectedValue = val
        },
        setLabModelList(list: Array<any>) {
            this.labModelList = list
        },
        setimageSrc(img: any) {
            this.imageSrc = img
        },
        setCurrModel(model: any) {
            this.currModel = model
            console.log("currModel-->")
            console.log(this.currModel)
        },
        setCanNextModel(can: boolean) {
            this.canNextModel = can
        },

    },
    getters: {
        getTaskId: (state) => state.taskId,
        getTaskName: (state) => state.taskName,
        getSelectedValue: (state) => state.selectedValue,
        getLabModelList: (state) => state.labModelList,
        getimageSrc: (state) => state.imageSrc,
        getCurrModel: (state) => state.currModel,
    }
});