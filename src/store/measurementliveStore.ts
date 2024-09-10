// stores/draggableStore.js
import { defineStore } from 'pinia';

export const useMersurementliveStore = defineStore('mersurementliveShow', {
    state: () => ({
        showMersurementlive: false,
    }),
    actions: {
        channgeMersurementlive() {
            this.showMersurementlive = !this.showMersurementlive;
        },
        displayMersurementlive() {
            this.showMersurementlive = true
        },
        hiddenMersurementlie() {
            this.showMersurementlive = false
        }
    },
});
