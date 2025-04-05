<template>
    <div ref="scrollContainer" style="height: 100%; overflow-y: auto" @scroll="handleScroll">
        <div v-for="item in visibleItems" :key="item.id" v-memo="[item]" ref="itemRefs" style="min-height: 100px;">
            {{ item.name }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { debounce } from 'lodash-es';

// 模拟大量数据
const allItems = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
}));

const visibleItems = ref([]);
const scrollContainer = ref(null);
const itemRefs = ref([]);
const itemHeights = ref([]);
const startIndex = ref(0);
const endIndex = ref(0);

const filteredItems = computed(() => {
    return allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const measureItemHeight = (element) => {
    console.log("measureItemHeight")
    console.log(element)
    const index = itemRefs.value.indexOf(element);
    if (index > -1) {
        itemHeights.value[index] = element.offsetHeight;
        console.log(itemHeights.value)
        calculateVisibleRange();
    }
};

const calculateVisibleRange = () => {
    const scrollTop = scrollContainer.value.scrollTop;
    const scrollOffset = scrollContainer.value.offsetHeight;
    console.log(scrollTop, scrollOffset)
    let accumulatedHeight = 0;
    let newStartIndex = 0;
    let newEndIndex = 0;

    for (let i = 0; i < itemHeights.value.length; i++) {
        if (accumulatedHeight < scrollTop) {
            newStartIndex = i;
            console.log('111')
        }
        accumulatedHeight += itemHeights.value[i];
        if (accumulatedHeight > scrollTop + scrollContainer.value.offsetHeight) {
            newEndIndex = i + 1;
            console.log('222')
            break;
        }
    }

    // startIndex.value = newStartIndex;
    // endIndex.value = newEndIndex;
    // visibleItems.value = filteredItems.value.slice(startIndex.value, endIndex.value);
};


const handleScroll = debounce(() => {
    // 滚动事件处理
    calculateVisibleRange();
}, 100);


onMounted(() => {
    // 初始化 visibleItems
    visibleItems.value = allItems.slice(0, 100)
    console.log(visibleItems.value)
    nextTick(() => {
        itemRefs.value.forEach(measureItemHeight);
        calculateVisibleRange();
    });
});
</script>