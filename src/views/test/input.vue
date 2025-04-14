<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl">
            <div class="bg-white rounded-lg shadow-sm p-4">
                <div class="relative">
                    <textarea v-model="inputText" :maxlength="maxLength" placeholder="请输入内容..."
                        class="w-full min-h-[120px] p-4 bg-[#F0F5FF] rounded-lg resize-none outline-none border-none text-gray-700"
                        @input="handleInput" ref="textareaRef"></textarea>

                    <div class="absolute bottom-4 right-4 flex items-center space-x-3">
                        <span class="text-gray-400 text-sm">{{ currentLength }}/{{ maxLength }}</span>

                        <button class="text-gray-400 hover:text-gray-600 transition-colors !rounded-button">
                            <i class="fas fa-image text-lg"></i>
                        </button>

                        <button class="text-white px-3 py-2 transition-colors !rounded-button"
                            :class="[inputText.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300']"
                            @click="handleSubmit">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';

const inputText = ref('');
const maxLength = 600;
const currentLength = ref(0);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleInput = () => {
    currentLength.value = inputText.value.length;
    adjustTextareaHeight();
};

const adjustTextareaHeight = () => {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
    }
};

const handleSubmit = () => {
    if (inputText.value.length > 0) {
        console.log('提交内容:', inputText.value);
        inputText.value = '';
        currentLength.value = 0;
        adjustTextareaHeight();
    }
};

onMounted(() => {
    if (textareaRef.value) {
        textareaRef.value.focus();
    }
});

watch(inputText, (newValue) => {
    if (newValue.length > maxLength) {
        inputText.value = newValue.slice(0, maxLength);
    }
});
</script>

<style scoped>
.textarea-container {
    position: relative;
    width: 100%;
}

textarea {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    line-height: 1.6;
}

textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-track {
    background: transparent;
}

textarea::-webkit-scrollbar-thumb {
    background-color: #CBD5E0;
    border-radius: 3px;
}

/* 移除number input的箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>