// stores/chatStore.js
import { defineStore } from 'pinia';

export const device3835Store = defineStore('device3835Store', {
    state: () => ({
        circuitNeedCheck: false,
        circuitData: ref<any[]>([]),
        circuitError: false,
        circuitGetted: false,

    }),
    actions: {
        setCircuitNeedChec(needCheck: boolean) {
            this.circuitNeedCheck = needCheck
        },
        setCircuitData(circuitData: any[]) {
            this.circuitData = circuitData
        },
        setCircuitError(isError: boolean) {
            this.circuitError = isError
        },
        setCircuitGetted(isGetted: boolean) {
            this.circuitGetted = isGetted
        }
    },
    getters: {
        getCircuitData: (state) => state.circuitData,
    }
});