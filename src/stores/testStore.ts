// stores/chatStore.js
import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
    state: () => ({
        aiRole: '',
        referenceMaterial: ''
    }),
    actions: {
        setAIRole(role: any) {
            this.aiRole = role;
        },
        setReferenceMaterial(material: any) {
            this.referenceMaterial = material;
        }
    },
    getters: {
        getAIRole: (state) => state.aiRole,
        getReferenceMaterial: (state) => state.referenceMaterial
    }
});