// stores/draggableStore.js
import { defineStore } from 'pinia';

export const useDraggableStore = defineStore('draggable', {
    state: () => ({
        showDraggable: true,
    }),
    actions: {
        toggleDraggable() {
            this.showDraggable = !this.showDraggable;
        },
    },
});
