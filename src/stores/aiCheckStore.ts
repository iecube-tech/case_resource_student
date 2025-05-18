// stores/chatStore.js
import { defineStore } from 'pinia';

export const aiCheckStore = defineStore('check', {
    state: () => ({
        checkId: '',
        sectionPrefix: '',
        needCheekList: <any>[],
        checkRes: ref({ id: '', score: 0 })
    }),
    actions: {
        setCheckId(checkId: string) {
            this.checkId = checkId
        },
        setSectionPrefix(sectionPrefix: any) {
            this.sectionPrefix = sectionPrefix
        },
        addNeedCheckItem(item: any) {
            this.needCheekList.push(item);
        },
        setCheckRes(id: string, score: number) {
            this.checkRes.id = id;
            this.checkRes.score = score;
        },
        shiftCheckList() {
            this.needCheekList.shift()
            console.log(this.needCheekList)
        }
    },
    getters: {
        getCheckId: (state) => state.checkId,
        getSectionPrefix: (state) => state.sectionPrefix,
        // getNeedCheekFirst: (state) => state.needCheekList.shift(),
        getCheckRes: (state) => state.checkRes
    }
});