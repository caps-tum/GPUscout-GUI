<template>
    <div class="group m-0 flex space-x-1" @click="selectLine">
        <p
            class="sticky left-0 top-0 w-10 shrink-0 select-none bg-gray-600 px-1 group-hover:bg-gray-200"
            :class="getHighlight()"
        >
            {{ lineNumber }}
        </p>
        <p class="flex h-6 max-h-6 flex-grow flex-row text-nowrap group-hover:bg-blue-400" :class="getHighlight()">
            <CodeLineToken v-for="token in tokens" :key="token" :line-number="lineNumber" :mode="mode" :token="token" />
        </p>
    </div>
</template>
<script setup>
import { useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { computed } from 'vue';
import CodeLineToken from './CodeLineToken.vue';

const props = defineProps({
    tokens: Array,
    lineNumber: [Number, String],
    mode: Number
});

const codeViewerStore = useCodeViewerStore();

const currentView = computed(() => codeViewerStore.getCurrentView);
const selectedLine = computed(() => codeViewerStore.getSelectedLine);
const highlightedLines = computed(() => codeViewerStore.getHighlightedLines);

function selectLine() {
    codeViewerStore.setCurrentView(props.mode);
    codeViewerStore.setSelectedLine(props.lineNumber);
}

function getHighlight() {
    if (currentView.value === props.mode) {
        return selectedLine.value === props.lineNumber ? 'bg-green-400' : '';
    } else {
        return highlightedLines.value.includes(props.lineNumber) ? 'bg-green-400' : '';
    }
}
</script>
