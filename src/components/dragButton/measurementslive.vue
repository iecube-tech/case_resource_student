<template>
    <div v-if="showDraggable" title="measurementslive" ref="draggable" class="draggable" @mousedown="handleMouseDown"
        @mouseup="handleMouseUp" @mousemove="drag" @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter"
        :style="positionStyle"></div>

    <el-dialog v-model="dialogVisible" fullscreen lock-scroll :show-close="false" class="fullscreen-dialog">
        <measurementslive class="meter"></measurementslive>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDraggableStore } from '@/store/draggableStore';
import measurementslive from '@/views/meter/measurementslive.vue'

const store = useDraggableStore();
const showDraggable = computed(() => store.showDraggable);

const position = ref({ top: '0px', left: '0px' });
const dragging = ref(false);
const offset = ref({ x: 0, y: 0 });
const DRAG_THRESHOLD = 200; // 鼠标按下时间阈值
const mouseDownTime = ref()

const dialogVisible = ref(false)

const percetTop = ref(0.618)
const percetLeft = ref(0)
const downLeaveUp = ref(false)

const handleMouseDown = (event: MouseEvent) => {
    dragging.value = false;
    mouseDownTime.value = Date.now();
    startDrag(event)
}

const handleMouseUp = (event: MouseEvent) => {
    dragging.value = false;
    const mouseUpDuration = Date.now() - mouseDownTime.value;
    if (mouseUpDuration < DRAG_THRESHOLD) {
        handleClick(event)
    }
}

const handleMouseLeave = (event: MouseEvent) => {
    const mouseUpDuration = Date.now() - mouseDownTime.value;
    if (mouseUpDuration < DRAG_THRESHOLD) {
        console.log(1)
        downLeaveUp.value = true
    }
}
const handleMouseEnter = () => {
    if (downLeaveUp.value == true && dragging.value) {
        dragging.value = false;
        downLeaveUp.value = false
    }
}

const startDrag = (event: MouseEvent) => {
    dragging.value = true;
    offset.value = {
        x: event.clientX - parseInt(position.value.left, 10),
        y: event.clientY - parseInt(position.value.top, 10),
    };
};

const stopDrag = () => {
    dragging.value = false;
};

const handleClick = (event: MouseEvent) => {
    if (!dragging.value) {
        dialogVisible.value = !dialogVisible.value;
    }
};

const drag = (event: MouseEvent) => {
    const mouseUpDuration = Date.now() - mouseDownTime.value;
    if (mouseUpDuration >= DRAG_THRESHOLD) {
        if (dragging.value) {
            position.value = {
                top: `${event.clientY - offset.value.y}px`,
                left: `${event.clientX - offset.value.x}px`,
            };
            percetTop.value = (event.clientY - offset.value.y) / window.innerHeight
            percetLeft.value = (event.clientX - offset.value.x) / window.innerWidth
        }
    }

};

const handleResize = () => {
    position.value = {
        top: `${(percetTop.value * window.innerHeight) - offset.value.y}px`,
        left: `${(percetLeft.value * window.innerWidth) - offset.value.x}px`,
    };

}

const positionStyle = computed(() => ({
    top: position.value.top,
    left: position.value.left,
    position: 'fixed',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
}));

onMounted(() => {
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('resize', handleResize);
    position.value.top = (window.innerHeight * 0.618) + 'px'

});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<style>
.draggable {
    position: fixed;
    z-index: 4000;
    cursor: pointer;
    user-select: none;
    background-image: url('@/assets/measurementslive/favicon.ico');
    background-size: cover;
    background-position: center;
    transition: transform 0.1s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.draggable:hover {
    filter: brightness(80%);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
</style>