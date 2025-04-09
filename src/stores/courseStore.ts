import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCourseStore = defineStore('courseStore', {
    state: () => ({
        dialog: false,
        currCourse: <null | { id: null, groupLimit: null }>null,
        currTasks: <null | [any]>null,
        currTask: <null | { taskId: null, taskName: '' }>null,
        currPage: 'taskList',
    }),
    actions: {
        setDialog(dialog: boolean) {
            this.dialog = dialog;
        },
        setCurrCourse(course: any) {
            this.currCourse = course
        },
        setCurrTaskList(tasks: any) {
            this.currTasks = tasks
        },
        setCurrTask(task: any) {
            this.currTask = task
        },
        setCurrPage(page: string) {
            this.currPage = page
        },
    },
    getters: {
        getDialog: (state) => state.dialog,
        getCurrCourse: (state) => state.currCourse,
        getCurrTask: (state) => state.currTask,
        getCurrTasks: (state) => state.currTasks,
    }
});