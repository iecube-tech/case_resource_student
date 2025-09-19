<template>
    <div class="stu-task">
        <div class="left-pan g-gray-50e" :style="{
            width: leftPaneWidth + 'px',
            transition: shouldAnimate ? 'width 0.3s ease' : 'none'
        }">
            <div ref="leftC" class="left-container">
                <labHeader :name="taskName" />
                <taskBook v-if="taskRoots.length > 0" :roots="taskRoots" class="ist-theam"
                    @scrollToTop="handleScrollToTop" />
                <!-- <mainView :taskId="taskId" :controllerDeviceVisible="controllerDeviceVisible" /> -->
                <labFooter :name="taskName" />
            </div>
            <!-- 中间悬浮图标 -->
            <div class="toggle-icon" @click="toggleRightPane" :title="isRightPaneVisible ? '隐藏右侧分区' : '显示右侧分区'">
                <img src="@/assets/images/aiIcon2.svg" />
            </div>
        </div>
        <!-- 调整大小div -->
        <div class="resizer" @mousedown="startResize" :style="{ cursor: isResizing ? 'col-resize' : 'default' }"></div>


        <!-- ai窗口 -->
        <div class="right-pane" :style="{
            width: rightPaneWidth + 'px',
            display: isRightPaneVisible ? 'block' : 'none',
            transition: shouldAnimate ? 'width 0.3s ease' : 'none'
        }">
            <div class="right-container" :style="{ maxWidth: rightPaneWidth + 'px', }">
                <aiChat v-if="deviceId == 1 && AssistantChat" :chatId="AssistantChat" />
                <!-- <aiChatController v-if="controllerDeviceVisible"></aiChatController> -->
            </div>
        </div>

        <div v-if="labStore.showZoomed" class="overlay" @click="labStore.showZoomed = false">
            <img :src="labStore.getimageSrc" alt="放大的示例图片" class="zoomed-image" />
        </div>

        <div v-if="deviceId == 1 && taskId">
            <answerCheck3835 :taskId="parseInt(taskId)" :version="4"></answerCheck3835>
        </div>
    </div>
</template>

<script setup lang="ts">
import aiChat from './AICom/aiChat.vue';
// import aiChatController from './AICom/aiChatController.vue'
import { GetAssistantChatId } from '@/apis/AI/getAssistantChatId';
// import { ElMessage } from 'element-plus';
// import { GetTask } from '@/apis/task/getTaskById';
// import { getProject } from '@/apis/project/getproject';
// import mainView from './components/mainView.vue';
import { useChatStore } from '@/stores/aiStore';
import { useEmdStore } from '@/stores/emdLabStore';
import answerCheck3835 from './check/check.vue';
import labHeader from './components/header.vue';
import labFooter from './components/footer.vue';
import taskBook from './components/taskBook.vue'
import '@/styles/stuTaskV4/stuLab.css'

const route = useRoute()

// const taskId = ref()
const aiStore = useChatStore()
const labStore = useEmdStore()

// 右侧分区宽度
const rightPaneWidth = ref(0);
const rightMinWidth = ref(400)
// 左侧分区宽度
const leftPaneWidth = ref(window.innerWidth - rightPaneWidth.value);
// 是否正在调整大小
const isResizing = ref(false);
// 右侧分区是否可见
const isRightPaneVisible = ref(false);
// 窗口宽度
const windowWidth = ref(window.innerWidth);
// 左右分区比例
const partitionRatio = ref(rightPaneWidth.value / (rightPaneWidth.value + leftPaneWidth.value));
// 是否应该应用过渡效果
const shouldAnimate = ref(false);

// 设备类型id 
const deviceId = ref(0);
const activeTab = ref('report')

// 定位到锚点
const toModel = (moduleId: string) => {
    activeTab.value = 'report'
    if (activeTab.value !== 'report') {
        activeTab.value = 'report'
    }
    window.location.hash = moduleId
}

// const controllerDeviceVisible = computed(() => {
//     return deviceId.value == '2';
// })

// 开始调整大小
const startResize = (e: any) => {
    isResizing.value = true;
    shouldAnimate.value = false; // 开始拖拽时关闭过渡效果
    document.documentElement.style.setProperty('--transition-duration', '0s'); // 禁用过渡效果，避免在拖拽过程中触发过渡动画
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
};

// 调整大小过程
const resize = (e: any) => {
    // 手动触发 resize 事件
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    if (isResizing.value) {
        const newWidth = windowWidth.value - e.clientX;
        // 限制右侧分区宽度在 rightMinWidth.value 到窗口宽度的一半之间
        if (newWidth >= rightMinWidth.value && newWidth <= windowWidth.value * 0.5) {
            rightPaneWidth.value = newWidth;
            leftPaneWidth.value = windowWidth.value - newWidth;
            partitionRatio.value = rightPaneWidth.value / (rightPaneWidth.value + leftPaneWidth.value);
        }
    }
};

// 停止调整大小
const stopResize = () => {
    isResizing.value = false;
    shouldAnimate.value = true; // 停止拖拽时开启过渡效果
    document.documentElement.style.setProperty('--transition-duration', '0.2s'); // 恢复过渡效果
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
};

// 切换右侧分区可见性
const toggleRightPane = () => {
    shouldAnimate.value = false; // 切换可见性时关闭过渡效果
    isRightPaneVisible.value = !isRightPaneVisible.value;
    aiStore.setChangeRightPaneVisible(isRightPaneVisible.value)
    if (isRightPaneVisible.value) {
        rightPaneWidth.value = windowWidth.value * partitionRatio.value;
        if (rightPaneWidth.value > windowWidth.value * 0.5) {
            rightPaneWidth.value = windowWidth.value * 0.5;
        } else if (rightPaneWidth.value < rightMinWidth.value) {
            rightPaneWidth.value = rightMinWidth.value;
        }
        leftPaneWidth.value = windowWidth.value - rightPaneWidth.value;
    } else {
        leftPaneWidth.value = windowWidth.value;
    }
    // 短暂延迟后恢复过渡效果
    setTimeout(() => {
        shouldAnimate.value = true;
    }, 100);
};

// 初始时开右侧 AI 面板
toggleRightPane();

watch(() => aiStore.changeRightPaneVisible, (newVal) => {
    if (newVal == true) {
        if (isRightPaneVisible.value) {
            return
        }
        toggleRightPane()
    }
    if (newVal == false) {
        if (!isRightPaneVisible.value) {
            return
        }
        toggleRightPane()
    }
})

// 处理窗口大小变化
const handleWindowResize = () => {
    shouldAnimate.value = false; // 窗口大小改变时关闭过渡效果
    windowWidth.value = window.innerWidth;
    if (isRightPaneVisible.value) {
        rightPaneWidth.value = windowWidth.value * partitionRatio.value;
        if (rightPaneWidth.value > windowWidth.value * 0.5) {
            rightPaneWidth.value = windowWidth.value * 0.5;
        } else if (rightPaneWidth.value < rightMinWidth.value) {
            rightPaneWidth.value = rightMinWidth.value;
        }
        leftPaneWidth.value = windowWidth.value - rightPaneWidth.value;
    } else {
        leftPaneWidth.value = windowWidth.value;
    }
    // 短暂延迟后恢复过渡效果
    setTimeout(() => {
        shouldAnimate.value = true;
    }, 100);
};

const AssistantChat = ref()
const labAiInit = () => {
    if (project.value?.deviceId == 1) {
        // 3835 ai 助手的chatId
        GetAssistantChatId(Number(taskId.value), 4).then(res => {
            if (res.state == 200) {
                AssistantChat.value = res.data
                aiStore.setAssistantChatId(AssistantChat.value)
            } else {
                ElMessage.error(res.message)
            }
        })
    }
    if (project.value?.deviceId == 2) {
        // 2830 ai 助手的chatId
    }
}

const leftC = ref()

// const task = ref()
// const getTask = (id: number) => {
//     GetTask(id).then(res => {
//         if (res.state == 200) {
//             task.value = res.data
//             labStore.setTaskName(task.value.task.studentTaskBook.name)
//         } else {
//             ElMessage.error(res.message)
//         }
//     })
// }

const isScrolling = ref(false)
const handleScroll = () => {
    leftC.value.addEventListener('scroll', () => {
        isScrolling.value = true
        console.log('scroll')
        const sections = document.querySelectorAll('.section-container');
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                window.location.hash = section.id;
            }
        });
        setTimeout(() => {
            isScrolling.value = false
        }, 500)
    });
};

// 监听 hashchange 事件
const handleHash = () => {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target && !isScrolling.value) {
                // 使用 scrollIntoView 方法滚动到目标元素
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // 页面加载时检查 hash
    const initialHash = window.location.hash;
    if (initialHash) {
        const target = document.querySelector(initialHash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                });
            }, 300)
        }
    }
}


/**
 * 
 * emd v4 相关逻辑
 * 
 */
import { useEmdV4Store } from '@/stores/emdV4TaskStore';
import { getEmdV4TaskDetail, projectDetail } from '@/apis/emdV4/index'
import { aiCheckStore } from '@/stores/aiCheckStore';

const aiCheckStoreItem = aiCheckStore()

const projectId = ref(route.params.projectId)
const taskId = ref(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
const task = ref<any>()
const project = ref<any>()
const taskName = ref('')
const taskRoots = ref([])

const emdV4Store = useEmdV4Store()

const initTask = async () => {
    await getEmdV4TaskDetail(taskId.value).then(res => {
        if (res.state == 200) {
            task.value = res.data
            // 设置当前实验显示的步骤
            emdV4Store.setCurrentStage(res.data.studentTaskBook.currentChild)
            aiStore.sectionPrefix = task.value.studentTaskBook.sectionPrefix
            aiCheckStoreItem.setSectionPrefix(task.value.studentTaskBook.sectionPrefix)
            taskName.value = res.data.studentTaskBook.name
            taskRoots.value = res.data.studentTaskBook.children
            emdV4Store.setTaskBookChildren(res.data.studentTaskBook.children)
            let mapping = handleCompMapping(res.data.studentTaskBook.children)
            emdV4Store.setComponentMapping(mapping)
        } else {
            ElMessage.error(res.message)
        }
    })
}

const handleCompMapping = (firstlevelChildren) => {
    let mapping = {}
    for (let i = 0; i < firstlevelChildren.length; i++) {
        let child = firstlevelChildren[i]
        let subChildren = child.children || []
        let res = loopChlildren(subChildren)
        for (let j = 0; j < res.length; j++) {
            let compItem = res[j]
            mapping[compItem.id] = i
        }
    }
    return mapping;
}

const loopChlildren = (subChildren) => {
    let res = [];
    for (let i = 0; i < subChildren.length; i++) {
        let subChild = subChildren[i]
        if (!subChild.hasChildren) {
            for (let j = 0; j < subChild.components.length; j++) {
                res.push(subChild.components[j])
            }
        } else {
            res = res.concat(loopChlildren(subChild.children))
        }
    }
    return res;
}

const initProject = async () => {
    await projectDetail(projectId.value).then(res => {
        if (res.state == 200) {
            project.value = res.data
            deviceId.value = res.data.deviceId
            emdV4Store.setProject(res.data)
        } else {
            ElMessage.error(res.message)
        }
    })
}

const handleScrollToTop = async () => {
    if(leftC.value){
        await nextTick()
        leftC.value.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const init = async () => {
    await initProject()
    await initTask()
    labAiInit()
    if (leftC.value) {
        handleHash()
    }
}

onMounted(() => {
    init()
    window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
    // 组件卸载时移除窗口大小变化监听器，避免内存泄漏
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<style scoped>
.stu-task {
    display: flex;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
}

.left-pane {
    background-color: #fff;
    position: relative;

}

.left-container {
    height: 100%;
    width: 100%;
    overflow: auto;
    scroll-behavior: smooth;
}

.toggle-icon {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    background: #33e2ed;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
}

.toggle-icon:hover {
    background: rgba(178, 250, 243, 0.6);
}

.toggle-icon img {
    width: 60%;
    /* 图标内部 SVG 图片大小 */
    height: 60%;
    filter: invert(1);
    /* 图标颜色反转，使其在深色背景下可见 */
}

.resizer {
    width: 7px;
    background-color: #f0f0f0;
    cursor: col-resize;
    transition: background-color 0.2s ease;
}

.resizer:hover {
    background-color: #22c8ca;
}

.right-pane {
    background-color: #fff;
}

.right-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.zoomed-image {
    max-width: 90%;
    max-height: 90%;
}
</style>