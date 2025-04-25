import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmdStore = defineStore('emdLab', {
    state: () => ({
        taskId: ref(),
        taskName: ref(),
        deviceDataDialog: ref(true), // 设备 对话框
        hasNewVal: ref(false), // 设备 有新值
        selectedValue: ref(), // 设备 值
        selectedCell: ref(),
        labModelList: ref(),
        emdStudentTask: <any>{},
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
        setSelectCell(cellId: any) {
            this.selectedCell = cellId
        },
        setLabModelList(list: Array<any>) {
            this.labModelList = list
        },
        setEmdStudentTask(emdStudentTask: any) {
            this.emdStudentTask = emdStudentTask
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
        getCellId: (state) => state.selectedCell,
        getLabModelList: (state) => state.labModelList,
        getEmdStudentTask: (state) => state.emdStudentTask,
        getimageSrc: (state) => state.imageSrc,
        getCurrModel: (state) => state.currModel,
    }
});