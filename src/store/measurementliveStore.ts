// stores/draggableStore.js
import { defineStore } from 'pinia';

export const useMersurementliveStore = defineStore('mersurementliveShow', {
    state: () => ({
        showMersurementlive: false,
    }),
    actions: {
        channgeMersurementlive() {
            this.showMersurementlive = !this.showMersurementlive;
            return
        },
        displayMersurementlive() {
            this.showMersurementlive = true
            return
        },
        hiddenMersurementlie() {
            this.showMersurementlive = false
            return
        },
        getState() {
            return this.showMersurementlive
        }
    },
});
