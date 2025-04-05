// stores/chatStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', {
    state: () => ({
        assistantChatId: '',
        changeRightPaneVisible: '',
        aiRole: '',
        referenceMaterial: '',
        sectionPrefix: '',
        waittingMessage: ref(false),
        currQuestion: null, // ai助手提出的问题

    }),
    actions: {
        setAssistantChatId(assistantChatId: any) {
            this.assistantChatId = assistantChatId;
        },
        setAIRole(role: any) {
            this.aiRole = role;
        },
        setReferenceMaterial(material: any) {
            this.referenceMaterial = material;
        },
        setSectionPrefix(sectionPrefix: any) {
            this.sectionPrefix = sectionPrefix
        },
        setChangeRightPaneVisible(changeRightPaneVisible: any) {
            this.changeRightPaneVisible = changeRightPaneVisible
        },
        setCurrQuestion(question: any) {
            this.currQuestion = question
        },
    },
    getters: {
        getAssistantChatId: (state) => state.assistantChatId,
        getAIRole: (state) => state.aiRole,
        getReferenceMaterial: (state) => state.referenceMaterial,
        getSectionPrefix: (state) => state.sectionPrefix,
        getChangeRightPaneVisible: (state) => state.changeRightPaneVisible,
        getCurrQuestion: (state) => state.currQuestion,

    }
});