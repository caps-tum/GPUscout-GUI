<template>
    <div ref="line" class="group relative m-0 flex space-x-1" @click="selectLine">
        <p class="sticky left-0 top-0 w-16 shrink-0 select-none bg-secondary px-1 group-hover:bg-gray-200">
            {{ lineNumber }} {{ hasStalls ? '*' : '' }}
        </p>
        <p
            class="flex h-6 max-h-6 w-full flex-grow border-collapse flex-row overflow-hidden text-nowrap group-hover:bg-blue-400"
            :class="getHighlight()"
        >
            <CodeLineToken
                v-for="token in tokens"
                :key="token"
                :line-number="lineNumber"
                :mode="codeType"
                :token="token"
                :highlighted-tokens="highlightedTokens"
            />
        </p>
        <p
            v-if="showLiveRegisters"
            class="sticky right-0 top-0 w-16 shrink-0 select-none bg-secondary px-1 text-center group-hover:bg-gray-200"
        >
            {{ liveRegisters[0] || '-' }} | {{ liveRegisters[1] || '-' }}
        </p>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useCodeViewerStore } from '../../../stores/CodeViewerStore';
import CodeLineToken from './CodeLineToken.vue';
import { CODE_STYLES } from '../../../../../config/colors';

const props = defineProps({
    tokens: Array,
    lineNumber: [Number, String],
    codeType: Number,
    highlightedLines: Object,
    highlightedTokens: Object,
    scrollToLines: Array,
    isOccurrence: Boolean,
    hasStalls: Boolean,
    currentView: Number,
    selectedOccurrences: Array,
    liveRegisters: Array,
    showLiveRegisters: Boolean
});

const codeViewerStore = useCodeViewerStore();

const line = ref(null);

function selectLine() {
    codeViewerStore.setCurrentView(props.codeType);
    codeViewerStore.setSelectedLine(props.lineNumber);
}

/**
 * Determines the background style of this code line:
 * @returns {String}
 */
function getHighlight() {
    let style = '';
    if (props.isOccurrence) {
        style += CODE_STYLES.OCCURRENCE + ' ';
    }

    if (props.highlightedLines[props.lineNumber] !== undefined) {
        style += props.highlightedLines[props.lineNumber];
    }
    return style;
}

watch(
    () => props.scrollToLines,
    (newValue) => {
        if (newValue.includes(props.lineNumber)) {
            // Works only if behavior is auto for source code
            line.value.parentNode.scrollTo({
                top: line.value.offsetTop - line.value.parentNode.getBoundingClientRect().height / 2,
                behavior: 'smooth'
            });
        }
    },
    { deep: true }
);
</script>
<style scoped>
div:has(+ .group > .border-2) > .border-2 {
    @apply border-b-0;
}
</style>
