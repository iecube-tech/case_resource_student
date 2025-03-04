<template>
    <div class="container">
        <div class="left-pane" :style="{
            width: leftPaneWidth + 'px',
            transition: shouldAnimate ? 'width 0.3s ease' : 'none'
        }">

            <div class="left-container">
                <labDetail v-if="taskId" :taskId="parseInt(taskId)" />
            </div>

            <!-- 悬浮图标 -->
            <div class="toggle-icon" @click="toggleRightPane" :title="isRightPaneVisible ? '隐藏右侧分区' : '显示右侧分区'">
                <!-- 引入 SVG 图标 -->
                <img :src="isRightPaneVisible ? 'hide.svg' : 'show.svg'" alt="隐藏/显示图标" />
            </div>
        </div>
        <div class="resizer" @mousedown="startResize" :style="{ cursor: isResizing ? 'col-resize' : 'default' }"></div>
        <div class="right-pane" :style="{
            width: rightPaneWidth + 'px',
            display: isRightPaneVisible ? 'block' : 'none',
            transition: shouldAnimate ? 'width 0.3s ease' : 'none'
        }">
            <div class="right-container" :style="{
                maxWidth: rightPaneWidth + 'px',
            }">

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import labDetail from './EMDLabDetail/index.vue'
const route = useRoute()
const taskId = ref()

// 右侧分区宽度
const rightPaneWidth = ref(400);
const rightMinWidth = ref(400)
// 左侧分区宽度
const leftPaneWidth = ref(window.innerWidth - 400);
// 是否正在调整大小
const isResizing = ref(false);
// 右侧分区是否可见
const isRightPaneVisible = ref(true);
// 窗口宽度
const windowWidth = ref(window.innerWidth);
// 左右分区比例
const partitionRatio = ref(rightPaneWidth.value / (rightPaneWidth.value + leftPaneWidth.value));
// 是否应该应用过渡效果
const shouldAnimate = ref(false);

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
        if (newWidth >= rightMinWidth.value && newWidth <= windowWidth.value * 0.4) {
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
    if (isRightPaneVisible.value) {
        rightPaneWidth.value = windowWidth.value * partitionRatio.value;
        if (rightPaneWidth.value > windowWidth.value * 0.4) {
            rightPaneWidth.value = windowWidth.value * 0.4;
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

// 处理窗口大小变化
const handleWindowResize = () => {
    shouldAnimate.value = false; // 窗口大小改变时关闭过渡效果
    windowWidth.value = window.innerWidth;
    if (isRightPaneVisible.value) {
        rightPaneWidth.value = windowWidth.value * partitionRatio.value;
        if (rightPaneWidth.value > windowWidth.value * 0.4) {
            rightPaneWidth.value = windowWidth.value * 0.4;
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

onMounted(() => {
    // 挂载时添加窗口大小变化监听器
    window.addEventListener('resize', handleWindowResize);

    setTimeout(() => {
        taskId.value = route.params.id
    })
});

onUnmounted(() => {
    // 组件卸载时移除窗口大小变化监听器，避免内存泄漏
    window.removeEventListener('resize', handleWindowResize);
});
</script>

<style scoped>
.container {
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
}

.toggle-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    /* 图标宽度 */
    height: 30px;
    /* 图标高度 */
    background-color: rgba(0, 0, 0, 0.7);
    /* 背景颜色，半透明 */
    border-radius: 50%;
    /* 圆形样式 */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.toggle-icon:hover {
    background-color: rgba(0, 0, 0, 0.9);
    /* 鼠标悬浮时背景颜色加深 */
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
</style>