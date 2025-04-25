import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTaskGroupStore = defineStore('groupStoreStore', {
    state: () => ({
        currGroup: <null | { code: '', groupId: null, creator: any, groupName: '', submitted: any, codeUnableTime: null, limitNum: null, groupStudents: [any] }>null,
        currPage: 'groupInit',
    }),
    actions: {
        setCurrGroup(group: any) {
            this.currGroup = group
        },
        setCurrGroupCode(code: any) {
            if (this.currGroup) {
                this.currGroup.code = code
            }
        },
        setCurrPage(page: string) {
            this.currPage = page
        },
    },
    getters: {
        getCurrGroup: (state) => state.currGroup,
    }
});