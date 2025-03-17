<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
    <div class="bg-gray-50">
        <div class="split w-full h-screen">
            <div class="split-left p-6 overflow-y-auto">
                <div v-for="(module, index) in modules" :key="module.id" class="mb-8"
                    :class="{ hidden: !isModuleVisible(index + 1) }">
                    <h2 class="text-2xl font-bold mb-4">{{ module.title }}</h2>
                    <div class="bg-white rounded-lg p-6 shadow-sm">
                        <component :is="module.content" />
                        <div class="mt-4 flex gap-4">
                            <button v-if="index > 0" @click="handlePrevStep(index)"
                                class="el-button bg-gray-100 text-gray-600 hover:bg-gray-200 !rounded-button whitespace-nowrap ">
                                <el-icon class="mr-2">
                                    <ArrowLeft />
                                </el-icon>上一步
                            </button>
                            <button v-if="index < modules.length - 1" @click="showNextModule(index + 1)"
                                class="el-button bg-teal-300 text-white hover:bg-teal-400 !rounded-button whitespace-nowrap">
                                <el-icon class="mr-2">
                                    <ArrowRight />
                                </el-icon>下一步
                            </button>
                            <el-button v-if="index === modules.length - 1"
                                class="bg-teal-400 text-white hover:bg-teal-500 !rounded-button whitespace-nowrap"
                                @click="handleSubmit">
                                <el-icon class="mr-2">
                                    <Check />
                                </el-icon>提交
                            </el-button>
                            <el-button @click="toggleAIPanel"
                                class="bg-indigo-300 text-white hover:bg-indigo-400 !rounded-button whitespace-nowrap">
                                <el-icon class="mr-2">
                                    <QuestionFilled />
                                </el-icon>帮助
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gutter gutter-horizontal" style="width: 10px;" ref="gutter"></div>
            <div id="aiPanel" class="split-right bg-white border-l" :class="{ hidden: !showAI }">
                <div class="h-full flex flex-col">
                    <div class="p-4 border-b flex justify-between items-center">
                        <h3 class="font-medium">AI 助手</h3>
                        <el-button @click="closeAIPanel" class="text-gray-500 hover:text-gray-700">
                            <el-icon>
                                <Close />
                            </el-icon>
                        </el-button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatContainer">
                        <div v-for="(message, idx) in messages" :key="idx"
                            :class="message.isAI ? 'flex items-start gap-3' : 'flex items-start gap-3 justify-end'">
                            <template v-if="message.isAI">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center p-1"
                                    :class="message.role === 'teacher' ? 'bg-blue-500' : 'bg-green-500'">
                                    <el-icon v-if="message.role === 'teacher'" class="text-white text-lg">
                                        <Money />
                                    </el-icon>
                                    <el-icon v-else class="text-white text-lg">
                                        <UserFilled />
                                    </el-icon>
                                </div>
                                <div class="chat-message bg-gray-100 rounded-lg p-3">
                                    <p class="text-gray-700 text-xs">{{ message.content }}</p>
                                </div>
                            </template>
                            <template v-else>
                                <div class="chat-message bg-teal-500 bg-opacity-20 rounded-lg p-3">
                                    <p class="text-gray-700 text-xs">{{ message.content }}</p>
                                </div>
                                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="p-4 border-t">
                        <div class="relative">
                            <el-input v-model="messageInput" type="textarea" placeholder="请输入您的问题..." :rows="3"
                                :maxlength="200" :autosize="{ minRows: 3, maxRows: 6 }" class="flex-1 text-xs"
                                @keydown.enter.prevent="sendMessage" @keydown.shift.enter="handleNewline"
                                @keydown.ctrl.enter="handleNewline" />
                            <div class="absolute bottom-2 right-2 flex items-center space-x-2">
                                <span class="text-xs text-gray-400">{{ messageInput.length }}/200</span>
                                <el-icon class="cursor-pointer text-gray-400 hover:text-gray-600 text-sm"
                                    @click="handleUpload">
                                    <PictureFilled />
                                </el-icon>
                                <el-icon class="cursor-pointer text-sm"
                                    :class="messageInput.trim() ? 'text-teal-500 hover:text-teal-600' : 'text-gray-400'"
                                    @click="sendMessage">
                                    <Promotion />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="showExperimentComplete" class="fixed left-0 bottom-4"
                :style="{ width: showAI ? '70%' : '100%' }">
                <div class="flex justify-center w-full">
                    <el-button
                        class="!rounded-button whitespace-nowrap bg-teal-500 text-white border-none hover:bg-teal-600"
                        @click="handleExperimentComplete">
                        <el-icon class="mr-2">
                            <Flag />
                        </el-icon>
                        完成实验
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { ArrowLeft, ArrowRight, Check, QuestionFilled, Close, Cpu, User, Flag, PictureFilled, Promotion, Money, UserFilled } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
interface Message {
    content: string;
    isAI: boolean;
    role?: 'teacher' | 'assistant';
}
const showAI = ref(false);
const showExperimentComplete = ref(false);
const showFinalDialog = ref(false);
const messageInput = ref('');
const messages = ref<Message[]>([{
    content: '您好！我是您的AI助手，有什么可以帮您的吗？',
    isAI: true,
    role: 'teacher'
}]);
// 初始化时设置左侧占满
onMounted(() => {
    const left = document.querySelector('.split-left') as HTMLElement;
    const right = document.querySelector('.split-right') as HTMLElement;
    if (left && right) {
        left.style.width = '100%';
        right.style.width = '0%';
    }
});
const modules = [
    {
        id: 1,
        title: '实验目的',
        content: {
            template: `
<ol class="list-decimal list-inside space-y-2">
<li class="text-xs">深入理解化学反应原理和机制</li>
<li class="text-xs">掌握实验室安全操作规范</li>
<li class="text-xs">学习使用专业实验仪器设备</li>
<li class="text-xs">培养科学实验思维方法</li>
<li class="text-xs">提高动手实践能力</li>
</ol>
`
        }
    },
    {
        id: 2,
        title: '实验准备',
        content: {
            template: `
<div>
<h3 class="font-semibold mb-3 text-xs">1. 安全防护</h3>
<ul class="list-disc list-inside space-y-2 mb-4">
<li class="text-xs">穿戴实验服和防护眼镜</li>
<li class="text-xs">佩戴一次性手套</li>
<li class="text-xs">确认通风设备运行正常</li>
</ul>
<h3 class="font-semibold mb-3 text-xs">2. 实验器材</h3>
<ul class="list-disc list-inside space-y-2">
<li class="text-xs">烧杯 250ml × 2</li>
<li class="text-xs">移液管 10ml × 1</li>
<li class="text-xs">温度计 × 1</li>
<li class="text-xs">电子天平 × 1</li>
</ul>
</div>
`
        }
    },
    {
        id: 3,
        title: '反应原理',
        content: {
            template: `
<div class="space-y-4">
<h3 class="font-semibold mb-3">化学反应方程式</h3>
<div class="p-4 bg-gray-50 rounded-lg">
<p class="text-center font-mono text-xs">2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O</p>
</div>
<h3 class="font-semibold mb-3">反应条件</h3>
<ul class="list-disc list-inside space-y-2">
<li class="text-xs">温度：室温 (20-25°C)</li>
<li class="text-xs">压力：标准大气压</li>
<li class="text-xs">pH值：7.0-8.5</li>
</ul>
<h3 class="font-semibold mb-3">注意事项</h3>
<ul class="list-disc list-inside space-y-2">
<li>反应过程中需要持续搅拌</li>
<li>加入硫酸时要缓慢滴加</li>
<li>注意观察溶液颜色变化</li>
</ul>
</div>
`
        }
    },
    {
        id: 4,
        title: '操作步骤',
        content: {
            template: `
<div class="space-y-6">
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">1</div>
<div class="flex-1">
<h4 class="font-semibold mb-2 text-xs">配制溶液</h4>
<p class="text-gray-600 text-xs">称取2.0g NaOH，用蒸馏水配制成100ml的溶液，搅拌至完全溶解</p>
</div>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
<div class="flex-1">
<h4 class="font-semibold mb-2 text-sm">滴定装置准备</h4>
<p class="text-gray-600 text-sm">安装滴定管，检查活塞是否灵活，排除气泡</p>
</div>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
<div class="flex-1">
<h4 class="font-semibold mb-2 text-sm">加入指示剂</h4>
<p class="text-gray-600 text-sm">向NaOH溶液中滴加2-3滴酚酞指示剂</p>
</div>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
<div class="flex-1">
<h4 class="font-semibold mb-2 text-sm">开始滴定</h4>
<p class="text-gray-600 text-sm">缓慢滴加H₂SO₄溶液，直至溶液由粉红色变为无色</p>
</div>
</div>
</div>
`
        }
    },
    {
        id: 5,
        title: '数据记录',
        content: {
            template: `
<div class="space-y-6">
<div class="overflow-x-auto">
<table class="min-w-full border border-gray-200">
<thead>
<tr class="bg-gray-50">
<th class="px-6 py-3 text-left text-[10px] font-medium text-gray-500">序号</th>
<th class="px-6 py-3 text-left text-[10px] font-medium text-gray-500">NaOH体积(ml)</th>
<th class="px-6 py-3 text-left text-[10px] font-medium text-gray-500">H₂SO₄体积(ml)</th>
<th class="px-6 py-3 text-left text-[10px] font-medium text-gray-500">终点pH值</th>
</tr>
</thead>
<tbody class="bg-white">
<tr>
<td class="px-6 py-4 text-[10px] text-gray-500">1</td>
<td class="px-6 py-4 text-[10px] text-gray-500">20.0</td>
<td class="px-6 py-4 text-[10px] text-gray-500">10.2</td>
<td class="px-6 py-4 text-[10px] text-gray-500">7.2</td>
</tr>
<tr class="bg-gray-50">
<td class="px-6 py-4 text-sm text-gray-500">2</td>
<td class="px-6 py-4 text-sm text-gray-500">20.0</td>
<td class="px-6 py-4 text-sm text-gray-500">10.1</td>
<td class="px-6 py-4 text-sm text-gray-500">7.1</td>
</tr>
<tr>
<td class="px-6 py-4 text-sm text-gray-500">3</td>
<td class="px-6 py-4 text-sm text-gray-500">20.0</td>
<td class="px-6 py-4 text-sm text-gray-500">10.3</td>
<td class="px-6 py-4 text-sm text-gray-500">7.3</td>
</tr>
</tbody>
</table>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<h4 class="font-semibold mb-3">实验现象记录</h4>
<textarea rows="4" class="w-full p-2 border border-gray-300 rounded-md resize-none" placeholder="请记录实验过程中观察到的现象..."></textarea>
</div>
</div>
`
        }
    },
    {
        id: 6,
        title: '结果分析',
        content: {
            template: `
<div class="space-y-6">
<div class="bg-gray-50 p-4 rounded-lg">
<h3 class="font-semibold mb-3">计算与分析</h3>
<ol class="list-decimal list-inside space-y-3">
<li>计算反应的平均消耗量：
<div class="p-2 bg-white rounded mt-2">
<p class="font-mono">平均H₂SO₄体积 = (10.2 + 10.1 + 10.3) ÷ 3 = 10.2ml</p>
</div>
</li>
<li>计算反应的转化率：
<div class="p-2 bg-white rounded mt-2">
<p class="font-mono">转化率 = (实际产量 ÷ 理论产量) × 100% = 98.5%</p>
</div>
</li>
</ol>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<h3 class="font-semibold mb-3">误差分析</h3>
<ul class="list-disc list-inside space-y-2">
<li>仪器误差：±0.1ml</li>
<li>操作误差：滴定终点判断的主观性</li>
<li>环境因素：温度波动的影响</li>
</ul>
</div>
<div class="bg-gray-50 p-4 rounded-lg">
<h3 class="font-semibold mb-3">结论</h3>
<p class="text-gray-700 text-xs">通过实验验证了酸碱中和反应的化学计量比，实验结果与理论值基本吻合。误差在可接受范围内，实验结果可靠。</p>
</div>
</div>
`
        }
    }
];
const visibleModules = ref(new Set([1]));
const isModuleVisible = (moduleId: number) => visibleModules.value.has(moduleId);
const showNextModule = (moduleId: number) => {
    visibleModules.value.add(moduleId + 1);
    nextTick(() => {
        const modules = document.querySelectorAll('.split-left > div');
        if (modules[moduleId]) {
            modules[moduleId].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
};
const scrollToModule = (moduleId: number) => {
    const modules = document.querySelectorAll('.split-left > div');
    if (modules[moduleId]) {
        modules[moduleId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
const handlePrevStep = (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    scrollToModule(prevIndex);
};
const toggleAIPanel = () => {
    showAI.value = !showAI.value;
    const left = document.querySelector('.split-left') as HTMLElement;
    const right = document.querySelector('.split-right') as HTMLElement;
    if (left && right) {
        if (showAI.value) {
            left.style.width = '70%';
            right.style.width = '30%';
        } else {
            left.style.width = '100%';
            right.style.width = '0%';
        }
    }
};
const closeAIPanel = () => {
    showAI.value = false;
    const left = document.querySelector('.split-left') as HTMLElement;
    const right = document.querySelector('.split-right') as HTMLElement;
    if (left && right) {
        left.style.width = '100%';
        right.style.width = '0%';
    }
};
const sendMessage = (e: KeyboardEvent) => {
    if (e && (e.shiftKey || e.ctrlKey)) {
        return;
    }
    if (messageInput.value.trim()) {
        messages.value.push({
            content: messageInput.value,
            isAI: false
        });
        setTimeout(() => {
            messages.value.push({
                content: '收到您的消息，我会尽快回复。',
                isAI: true,
                role: Math.random() > 0.5 ? 'teacher' : 'assistant'
            });
        }, 500);
        messageInput.value = '';
    }
};
const handleNewline = (e: KeyboardEvent) => {
    // 允许换行
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    messageInput.value = value.substring(0, start) + '\n' + value.substring(end);
    nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
    });
};
const handleUpload = () => {
    // 处理上传图片逻辑
    console.log('Upload image');
};
const handleSubmit = () => {
    if (!showAI.value) {
        toggleAIPanel();
    }
    nextTick(() => {
        showExperimentComplete.value = true;
    });
};
const handleExperimentComplete = () => {
    const leftPanel = document.querySelector('.split-left');
    const leftPanelWidth = leftPanel?.getBoundingClientRect().width || 0;
    const leftPanelLeft = leftPanel?.getBoundingClientRect().left || 0;
    ElMessageBox.confirm('恭喜您完成实验', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        showCancelButton: false,
        center: true,
        customClass: 'experiment-dialog'
    });
    nextTick(() => {
        const dialog = document.querySelector('.experiment-dialog') as HTMLElement;
        if (dialog) {
            const dialogWidth = dialog.offsetWidth;
            dialog.style.left = `${leftPanelLeft + (leftPanelWidth - dialogWidth) / 2}px`;
            dialog.style.transform = 'none';
        }
    });
};
onMounted(() => {
    let isResizing = false;
    const container = document.querySelector('.split') as HTMLElement;
    const gutter = document.querySelector('.gutter') as HTMLElement;
    const left = document.querySelector('.split-left') as HTMLElement;
    const right = document.querySelector('.split-right') as HTMLElement;
    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const containerRect = container.getBoundingClientRect();
        const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (percentage > 50 && percentage < 85) {
            left.style.width = `${percentage}%`;
            right.style.width = `${100 - percentage}%`;
        }
    };
    gutter.addEventListener('mousedown', () => {
        isResizing = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
        });
    });
});
</script>
<style scoped>
body {
    min-height: 1024px;
    overflow-x: hidden;
}

:deep(.experiment-dialog) {
    position: fixed !important;
    margin: 0 !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
    cursor: col-resize;
}

.gutter:hover {
    background-color: #ddd;
}

.split {
    display: flex;
}

.split-left {
    width: 100%;
}

.split-right {
    width: 0%;
}

.chat-message {
    max-width: 80%;
}

.hidden {
    display: none;
}
</style>
